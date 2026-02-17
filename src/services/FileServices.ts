import { prisma } from "../lib/prisma.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../errors/AppError";

interface File {
  originalName: string;
  savedName: string;
  sessionId: string;
  fileSize: number;
  key?: string;
  path?: string;
}

export default class FileService {
  private s3: S3Client;

  constructor() {
    const requiredEnvVars = [
      "AWS_REGION",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY_ID",
      "AWS_BUCKET_NAME",
    ];

    const missingVars = requiredEnvVars.filter(
      (varname) => !process.env[varname],
    );

    if (missingVars.length > 0) {
      throw new Error(`Configurações do S3 ausentes no .env: ${missingVars}`);
    }

    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID!,
      },
    });
  }

  async presignedUrl(file: File, fileType: string) {
    const uniqueName = `${Date.now()}_${file.originalName}`;
    const fileKey = `${file.sessionId}/${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    await prisma.file.create({
      data: {
        ...file,
        savedName: uniqueName,
        key: fileKey,
        path: s3Url,
      },
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 });

    return uploadUrl;
  }

  async downloadUrl(fileId: string) {
    const file: File | null = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) throw new AppError("Arquivo para download não encontrado.");

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file?.key,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 900 });
  }

  async removeFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await this.s3.send(command);
    console.log(`Arquivo ${key} deletado com sucesso!`);
  }
}
