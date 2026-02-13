import { prisma } from "../lib/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFiles(
    sessionId: string,
    files: File[],
  ) {
    const results = await Promise.all(
      files.map(async (file) => {
        const uniqueName = `${file.name}_${Date.now()}`;
        const fileKey = `${sessionId}/${uniqueName}`;

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
          ContentType: file.type,
        });

        const signedUrl = await getSignedUrl(this.s3, command, {
          expiresIn: 300,
        });

        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        const fileRecord = await prisma.file.create({
          data: {
            originalName: file.name,
            savedName: uniqueName,
            fileSize: file.size,
            path: s3Url,
            key: fileKey,
            sessionId: sessionId,
          },
        });

        return { fileRecord, signedUrl };
      }),
    );

    return { fileRecords: results };
  }
}
