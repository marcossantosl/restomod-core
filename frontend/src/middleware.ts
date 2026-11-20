import { NextRequest, NextResponse } from 'next/server'
import { isTokenExpired } from '@/lib/jwt'

// Nome do cookie gravado em lib/auth.ts no login. Repetido aqui (em vez de
// importado) porque lib/auth.ts usa localStorage/document, que não existem no
// runtime Edge onde o middleware roda.
const AUTH_COOKIE = 'restomod_token'

// Rotas protegidas: roda antes de renderizar qualquer página que case com o
// "matcher" abaixo. Sem um token válido no cookie, o usuário é redirecionado
// para /login, levando a página original em ?next= para voltar depois.
export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value

  if (!token || isTokenExpired(token)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search)

    const resposta = NextResponse.redirect(loginUrl)
    if (token) resposta.cookies.delete(AUTH_COOKIE) // token expirado: limpa
    return resposta
  }

  return NextResponse.next()
}

// Protege todas as páginas, exceto login, cadastro, os Route Handlers (/api,
// que a própria API Express já protege com JWT) e os arquivos estáticos.
export const config = {
  matcher: ['/((?!login|registrar|api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|ico|webp)$).*)'],
}
