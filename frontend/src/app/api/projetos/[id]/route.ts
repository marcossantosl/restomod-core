import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function proxy(request: NextRequest, method: 'PUT' | 'DELETE', id: string) {
  const authHeader = request.headers.get('authorization')
  const body = method === 'DELETE' ? undefined : await request.text()

  const resposta = await fetch(`${BACKEND_URL}/api/projetos/${id}`, {
    method,
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return proxy(request, 'PUT', params.id)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return proxy(request, 'DELETE', params.id)
}
