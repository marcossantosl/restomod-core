import type { Metadata } from 'next'

// A página desta rota é um Client Component e não pode exportar metadata;
// este layout (Server Component) declara os metadados de SEO por ela.
export const metadata: Metadata = {
  title: 'Clientes',
  description: 'Cadastro de clientes da oficina de restomod.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
