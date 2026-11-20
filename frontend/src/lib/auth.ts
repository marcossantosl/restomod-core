import { getTokenExp } from './jwt'

const TOKEN_KEY = 'restomod_token'
const EMAIL_KEY = 'restomod_email'

// Nome do cookie lido pelo middleware (src/middleware.ts). O localStorage só
// existe no navegador; o cookie é enviado em toda requisição, então o servidor
// do Next consegue saber se há sessão antes de renderizar a página.
export const AUTH_COOKIE = 'restomod_token'

export function setSession(token: string, email: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EMAIL_KEY, email)

  // O cookie expira junto com o JWT (ou em 1 dia, se não der para ler o exp).
  const exp = getTokenExp(token)
  const maxAge = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : 60 * 60 * 24
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(EMAIL_KEY)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}

type Router = { push: (path: string) => void }

// Bloqueia a ação antes de chamar a API se não houver sessão ativa.
// Retorna true se pode prosseguir, false se já redirecionou pro login.
export function requireAuth(router: Router): boolean {
  if (isLoggedIn()) return true
  alert('Você precisa entrar para criar, editar ou remover registros.')
  router.push('/login')
  return false
}

// Trata 401 vindo da API (ex.: token expirou no meio da sessão).
// Retorna true se o erro era de autenticação e já redirecionou.
export function handleAuthError(error: any, router: Router): boolean {
  if (error?.response?.status === 401) {
    alert('Sua sessão expirou. Entre novamente.')
    clearSession()
    router.push('/login')
    return true
  }
  return false
}
