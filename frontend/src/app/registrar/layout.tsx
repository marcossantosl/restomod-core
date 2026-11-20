import type { Metadata } from 'next'

// A página desta rota é um Client Component e não pode exportar metadata;
// este layout (Server Component) declara os metadados de SEO por ela.
export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Cadastre-se no Restomod-Core.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
