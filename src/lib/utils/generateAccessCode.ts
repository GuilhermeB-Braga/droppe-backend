// Gera um código alfanumérico com 6 digitos para a criação da sessão.
export default function generateAccessCode(): string {
  const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  return accessCode;
}
