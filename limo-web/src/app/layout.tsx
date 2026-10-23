import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LIMO — Software Development Agency & Freelancing Marketplace',
  description:
    'Build Better. Work Smarter. Grow Together. Connect with vetted software engineering talent or build your next web app, mobile app, or AI system directly with LIMO dedicated engineering squads.',
  keywords: [
    'software agency',
    'freelancing marketplace',
    'web development',
    'mobile application',
    'react native',
    'AI integration',
    'next.js',
    'UI UX design',
  ],
  authors: [{ name: 'LIMO Platform' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0066FF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-50 dark:bg-limo-navyDark text-limo-navy dark:text-slate-100 antialiased transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
