import type { NextFunction, Request, Response } from "express";
import FileService from "../services/FileServices";
import { AppError } from "../errors/AppError";

const fileService = new FileService()

export default class FileController {
  async index(req: Request, res: Response) {
    return res
      .status(205)
      .json({ path: "/files", message: "Rota principal para files" });
  }

  async uploadFiles(req: Request, res: Response, next: NextFunction) {
    const { files } = req.body as { files: File[]}
    const { sessionId } = req.params as {sessionId: string};
    
    try {
      if (!files) throw new AppError("Arquivo(s) não enviado.");

      await fileService.uploadFiles(sessionId, files)
      
    } catch (error) {
      next(error);
    }
  }
}
