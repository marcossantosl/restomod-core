import { NextRequest, NextResponse } from 'next/server'

// Dentro do container Docker, "localhost" aponta para o próprio container do
// frontend, não para o backend — por isso usamos o hostname do serviço na
// rede interna do Compose (API_INTERNAL_URL), com fallback para uso local
// sem Docker (fora de um container, localhost:8080 funciona normalmente).
const BACKEND_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const authHeader = request.headers.get('authorization')

  const resposta = await fetch(`${BACKEND_URL}/api/projetos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body,
  })

  const dados = await resposta.text()
  return new NextResponse(dados, {
    status: resposta.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
