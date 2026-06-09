import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AttendIQ — Smart Attendance Admin Console',
    template: '%s | AttendIQ',
  },
  description:
    'Administrative control center for the Smart Attendance System. Monitor live lectures, manage rosters, and review attendance reports.',
  keywords: ['attendance', 'dashboard', 'admin', 'RFID', 'IoT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-page-bg text-fg-primary transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
