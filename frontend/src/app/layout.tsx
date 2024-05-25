import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientOnly from './components/ClientOnly';
import { ClusterProvider } from './components/cluster/cluster-data-access';
import { SolanaProvider } from './components/solana/solana-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Double Or Nothing',
  description: 'Play double or nothing! Enter an amount to bet. There is an equal chance of winning and losing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ClientOnly>
          <ClusterProvider>
            <SolanaProvider>{children}</SolanaProvider>
          </ClusterProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
