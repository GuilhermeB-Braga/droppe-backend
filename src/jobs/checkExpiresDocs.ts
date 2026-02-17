import { prisma } from "../lib/prisma.js";
import FileService from "../services/FileServices.js";
import SessionService from "../services/SessionService.js";

const fileService = new FileService();
const sessionService = new SessionService()

export default async function checkExpiresDocs() {
  const now = new Date();
  const threshold = new Date(now.getTime() - 900000);

  const expiresSessions = await prisma.session.findMany({
    where: { createdAt: { lte: threshold } },
    include: { files: true },
  });

  for (const session of expiresSessions) {
    for (const file of session.files) {
      try {
        await fileService.removeFile(file.key);
      } catch (error) {
        console.error("Erro inesperado no checkExpiresDocs: ", error);
      }
    }
  }

  const sessionIds = expiresSessions.map((s) => s.id);

  
  try {
    
    await sessionService.deleteManySessions(sessionIds)

    console.log(`${sessionIds.length} sessões e seus respectivos arquivos removidos.`)
  } catch (error) {
    console.error('Houve uma falha ao remover as sessões no banco. Error: ', error)
  }
}
