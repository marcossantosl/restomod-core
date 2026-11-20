// Lê o "exp" (expiração, em segundos) do payload de um JWT, sem verificar a
// assinatura. A assinatura só pode ser verificada com o JWT_SECRET, que fica
// no back-end; aqui só precisamos saber se o token ainda está no prazo. Quem
// garante que o token é legítimo continua sendo a API, que rejeita com 401.
// Usa apenas atob, por isso roda tanto no navegador quanto no middleware (Edge).
export function getTokenExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json)
    return typeof exp === 'number' ? exp : null
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExp(token)
  return exp === null || exp * 1000 <= Date.now()
}
