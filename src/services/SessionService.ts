import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import generateAccessCode from "../lib/utils/generateAccessCode";

class SessionService {
  async create(name: string) {
    const session = await prisma.session.create({
      data: {
        name: name,
        code: generateAccessCode(),
      },
    });

    if (!session) throw new AppError("Falha ao criar sessão", 400);

    return session;
  }

  async login(name: string, code: string) {
    const session = await prisma.session.findUnique({
      where: {
        name,
        code,
      },
    });

    if (!session) throw new AppError("Sessão não encontrada", 404);

    return session.id;
  }

  async getById(id: string) {
    const session = await prisma.session.findUnique({
      where: { id: id },
      include: {
        files: true,
      },
    });

    if (!session) throw new AppError("Sessão não encontrada", 400);

    return session;
  }

  async deleteById(id: string) {
    const session = await prisma.session.delete({
      where: { id: id },
    });

    if (!session) throw new AppError("Sessão não encontrada", 400);

    return session;
  }

  async deleteManySessions(ids: string[]) {
    await prisma.session.deleteMany({
      where: { id: { in: ids } },
    });
  }
}

export default SessionService;
