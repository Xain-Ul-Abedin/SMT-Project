'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork } from '@/lib/api';

export interface FramingOption {
  id: string;
  label: string;
  priceCents: number;
  description: string;
}

export const FRAMING_OPTIONS: FramingOption[] = [
  {
    id: 'UNFRAMED',
    label: 'Gallery Stretcher (Unframed)',
    priceCents: 0,
    description: 'Arrives stretched on archival heavy-duty kiln-dried pine bars, ready to hang.',
  },
  {
    id: 'MUSEUM_OAK',
    label: 'Handcrafted White Oak & UV Glass',
    priceCents: 22000,
    description: 'Museum-grade natural American white oak profile with 99% UV anti-reflective glass.',
  },
  {
    id: 'GOLD_LEAF',
    label: 'Florentine Gold Leaf Gilded',
    priceCents: 38000,
    description: 'Traditional 22k water-gilded Florentine leaf with antiqued hand-burnished bole.',
  },
  {
    id: 'CONTEMPORARY_FLOAT',
    label: 'Minimalist Obsidian Float Frame',
    priceCents: 18000,
    description: 'Deep reveal shadowbox floating canvas with 1/4-inch matte obsidian spacing.',
  },
];

export interface CartItem {
  artwork: Artwork;
  framing: FramingOption;
}

interface CartContextType {
  items: CartItem[];
  subtotalCents: number;
  totalCents: number;
  subtotalFormatted: string;
  totalFormatted: string;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (artwork: Artwork, framingId?: string) => boolean;
  removeFromCart: (artworkId: string) => void;
  updateFraming: (artworkId: string, framingId: string) => void;
  clearCart: () => void;
  isInCart: (artworkId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arts_gallery_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart storage', e);
      }
    }
  }, []);

  // Save to localStorage
  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('arts_gallery_cart', JSON.stringify(newItems));
  };

  const isInCart = (artworkId: string) => {
    return items.some(i => i.artwork.id === artworkId);
  };

  const addToCart = (artwork: Artwork, framingId: string = 'UNFRAMED'): boolean => {
    // Inventory Invariant: Unique original fine art pieces can only be acquired once per cart
    if (isInCart(artwork.id)) {
      setIsCartOpen(true);
      return false;
    }

    const framing = FRAMING_OPTIONS.find(f => f.id === framingId) || FRAMING_OPTIONS[0];
    const newItems = [...items, { artwork, framing }];
    saveItems(newItems);
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (artworkId: string) => {
    const newItems = items.filter(i => i.artwork.id !== artworkId);
    saveItems(newItems);
  };

  const updateFraming = (artworkId: string, framingId: string) => {
    const framing = FRAMING_OPTIONS.find(f => f.id === framingId) || FRAMING_OPTIONS[0];
    const newItems = items.map(item => {
      if (item.artwork.id === artworkId) {
        return { ...item, framing };
      }
      return item;
    });
    saveItems(newItems);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Financial Invariants (Integer Cents Precision)
  const subtotalCents = items.reduce((sum, item) => {
    return sum + item.artwork.priceCents + item.framing.priceCents;
  }, 0);

  const totalCents = subtotalCents; // White-Glove Curatorial Shipping is complimentary ($0)

  const formatCents = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotalCents,
        totalCents,
        subtotalFormatted: formatCents(subtotalCents),
        totalFormatted: formatCents(totalCents),
        itemCount: items.length,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateFraming,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
