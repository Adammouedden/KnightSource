import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ChatProvider } from '@/components/ChatProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnightSource - UCF Student Benefits Explorer',
  description: 'Discover campus resources and see the money you\'re leaving on the table at UCF.',
  openGraph: {
    title: 'KnightSource - UCF Student Benefits Explorer',
    description: 'Unlock every UCF benefit and maximize your campus resources.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            {children}
            <Toaster />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
