import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pravasi Jaalakam',
  description: 'A cultural, literary, and community-driven digital platform for the Malayalam-speaking expatriate community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ml">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}

