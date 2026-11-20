import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Anexa o token JWT (se existir) em toda requisição. Rotas que não exigem
// autenticação simplesmente ignoram o header; a rota protegida (escrita de
// Projeto) passa a funcionar assim que o usuário estiver logado.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
