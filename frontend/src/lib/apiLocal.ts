import axios from 'axios'
import { getToken } from './auth'

// Instância sem baseURL: as chamadas vão para a própria origem do Next.js
// (os Route Handlers em app/api/**), que repassam a requisição para o
// backend Express. Usada pelos fluxos de escrita que precisam passar por
// um Route Handler em vez de chamar a API externa direto do navegador.
const apiLocal = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

apiLocal.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiLocal
