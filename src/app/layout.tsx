import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import {esMX} from '@clerk/localizations'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MiduGuard - El guardián de Midulandia',
  description: 'Juego de verificación de identidades inspirado en Papers Please y con autenticación real usando Clerk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={esMX}>
      <html lang="es">
        <body className={inter.className}>
          <main className="min-h-screen bg-background text-white">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
