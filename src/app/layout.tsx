import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#0a0f1e] text-white">{children}</body>
    </html>
  );
}
