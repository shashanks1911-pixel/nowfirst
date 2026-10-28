import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NowFirst — One Spotlight. Yours Until Outbid.',
  description:
    'An independent live advertising spotlight for companies and social creators across Instagram, X, Facebook, and LinkedIn. Real-time takeovers with full displacement transparency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#FBFBFD] text-[#1D1D1F]">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-apple-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}

