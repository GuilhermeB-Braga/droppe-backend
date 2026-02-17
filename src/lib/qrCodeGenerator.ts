import QrCode from 'qrcode'

export default async function generateQrCodeBuffer(text: string){
    try {

        const buffer = await QrCode.toBuffer(text, {
            type: 'png',
            color: {
                dark: '#1d1d1d',
                light: '#e7e7e7'
            }
        })
        
        return buffer
        
    } catch (error) {
        console.error('Falha ao gerar o QR Code. Error: ', error)
    }
}