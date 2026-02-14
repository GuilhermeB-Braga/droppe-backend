import express from 'express'
import FileController from '../controller/FileController.js'

const fileController = new FileController

const router = express.Router()

router.get('/', fileController.index)
router.post('/:sessionId', fileController.getPresignedUrl)
router.get('/download/:fileId', fileController.getDownloadUrl)

export default router