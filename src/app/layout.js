import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Murmur - Messages Anonymes',
  description: 'Envoyez des messages anonymes à vos amis',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
  themeColor: '#5E5CE6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="overflow-x-hidden bg-[rgb(var(--color-background))]">
        <div className="min-h-screen">
          <main className="w-full mx-auto px-0 sm:px-4 md:px-6 max-w-7xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
