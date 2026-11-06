import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Arts Gallery | Curated Masterpieces & Visual Art Salon',
  description:
    'An exclusive digital salon connecting contemporary visual artists, master creators, and collectors worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gallery-alabaster text-gallery-charcoal antialiased selection:bg-gallery-gold/20 selection:text-gallery-gold-dark font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
