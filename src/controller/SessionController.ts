import type { Request, Response, NextFunction } from "express";
import SessionService from "../services/SessionService.js";
import { AppError } from "../errors/AppError.js";

const sessionService = new SessionService();

class SessionController {
  async index(req: Request, res: Response) {
    return res.status(200).json({
      path: "/session",
      message: "Rota principal para session",
    });
  }

  async loginSection(req: Request, res: Response, next: NextFunction) {
    const { name, code } = req.body as { name: string; code: string };

    if (!name) throw new AppError("Nome da sessão não informado.", 400);
    if (!code)
      throw new AppError("Código de acesso da sessão não informado.", 400);

    try {
      const sessionId = await sessionService.login(name, code);
      return res.status(200).json(sessionId);
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction) {
    const { sessionId } = req.params as { sessionId: string };

    if (!sessionId) throw new AppError("Código da sessão não informado");

    try {
      const session = await sessionService.getById(sessionId);

      return res.status(200).json(session);
    } catch (error) {
      next(error);
    }
  }

  async createSession(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    if (!name) throw new AppError("Nome da sessão não informado", 400);

    try {
      const session = await sessionService.create(name);

      return res.status(200).json(session);
    } catch (error) {
      next(error);
    }
  }

  async deleteSection(req: Request, res: Response, next: NextFunction) {
    const { sessionId } = req.params as { sessionId: string };

    if (!sessionId)
      throw new AppError("Código da sessão a ser excluída não informado");

    try {
      const session = await sessionService.deleteById(sessionId);

      res
        .status(200)
        .json({ status: "Ok", message: "Sessão deletada com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  async getSessionQrCode(req: Request, res: Response, next: NextFunction) {
    const session = req.query.session as string;

    if (!session) throw new AppError("Código da sessão não informado", 400);

    try {
      const text = `${process.env.CORS_ORIGIN_URL}/session/${session}`;

      const bufferImage = await sessionService.generateQrCode(text);

      if (!bufferImage)
        throw new AppError("Não foi possível gerar o buffer da imagem", 422);

      res.writeHead(200, {
        "content-type": "image/png",
        "content-length": bufferImage.length,
        "cache-control": "public, max-age=60",
      });

      res.end(bufferImage);
    } catch (error) {
      next(error);
    }
  }

  async deleteExpiredSessions(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization

    if(authHeader !== `Bearer ${process.env.CRON_SECRET}`) throw new AppError("Acesso negado", 403)

    try {
      const deletedCount = await sessionService.deleteExpiredSessions();
      res.status(200).json({
        status: "Ok",
        message: `Sessões expiradas deletadas com sucesso. Total de sessões deletadas: ${deletedCount}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SessionController;
