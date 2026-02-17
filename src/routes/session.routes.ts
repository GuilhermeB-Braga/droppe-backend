import express from 'express'
import SessionController from '../controller/SessionController.js'

const sessionController = new SessionController()

const router = express.Router()

router.get('/', sessionController.index) //rota principal
router.post('/', sessionController.createSession) //criar sessão
router.post('/login', sessionController.loginSection) //criar sessão
router.get('/qrcode', sessionController.getSessionQrCode) //gerar qrcode da sessão
router.get('/:sessionId', sessionController.getSession) //dados da sessão
router.delete('/expired', sessionController.deleteExpiredSessions) //verifica e deleta sessões expiradas
router.delete('/:sessionId', sessionController.deleteSection) //deletar sessão

export default router