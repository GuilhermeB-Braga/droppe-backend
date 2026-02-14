import type { NextFunction, Request, Response } from "express";
import FileService from "../services/FileServices";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";

const fileService = new FileService();

interface File {
  originalName: string;
  savedName: string;
  sessionId: string;
  fileSize: number;
  key?: string;
  path?: string;
}

export default class FileController {
  async index(req: Request, res: Response) {
    return res
      .status(205)
      .json({ path: "/files", message: "Rota principal para files" });
  }

  async getPresignedUrl(req: Request, res: Response, next: NextFunction) {
    const { file, fileType } = req.body as { file: File; fileType: string };

    try {
      if (!file) throw new AppError("Arquivo não enviado.");

      const uploadUrl = await fileService.presignedUrl(file, fileType);

      return res.status(200).json(uploadUrl);
    } catch (error) {
      next(error);
    }
  }

  async getDownloadUrl(req: Request, res: Response, next: NextFunction) {
    const { fileId } = req.params as {fileId: string}

    try {
      if (!fileId) throw new AppError("Id do arquivo não informado!", 204);

      const downloadUrl = await fileService.downloadUrl(fileId);

      return res.status(200).json(downloadUrl);
    } catch (error) {
      next(error);
    }
  }
}
