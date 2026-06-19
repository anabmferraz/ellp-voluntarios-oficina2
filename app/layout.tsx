import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ELLP — Termo de Voluntariado',
  description: 'Geração do Termo de Adesão para Voluntário(a) — Projeto ELLP UTFPR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
