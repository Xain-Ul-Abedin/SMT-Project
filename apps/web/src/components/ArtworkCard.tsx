'use client';

import React from 'react';
import { 
  ShoppingBag, 
  Check, 
  Eye, 
  ShieldCheck, 
  Lock,
  Maximize2
} from 'lucide-react';
import { Artwork } from '@/lib/api';
import { PillButton } from '@/components/ui/PillButton';
import { useCart } from '@/context/CartContext';

interface ArtworkCardProps {
  artwork: Artwork;
  onQuickView: (artwork: Artwork) => void;
}

export function ArtworkCard({ artwork, onQuickView }: ArtworkCardProps) {
  const { addToCart, isInCart } = useCart();
  const itemInCart = isInCart(artwork.id);

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const isAvailable = artwork.status === 'AVAILABLE' && artwork.stock > 0;
  const isReserved = artwork.status === 'RESERVED' || (artwork.status === 'AVAILABLE' && artwork.stock === 0);
  const isSold = artwork.status === 'SOLD';

  return (
    <article className="group bg-white border border-gallery-border/80 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Visual Canvas Area */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 select-none">
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Medium Badge */}
        <span className="absolute top-4 left-4 rounded-full px-3 py-1 bg-white/95 backdrop-blur-xs text-[11px] font-medium text-gallery-charcoal shadow-xs">
          {artwork.medium}
        </span>

        {/* Curatorial Status Capsule */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          {artwork.certificateOfAuthenticity?.issued && (
            <span 
              title="Includes Museum Certificate of Authenticity"
              className="rounded-full w-7 h-7 bg-white/95 backdrop-blur-xs flex items-center justify-center text-gallery-gold shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}

          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
            isAvailable 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : isReserved 
              ? 'bg-amber-50 text-amber-800 border border-amber-200' 
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            {artwork.status}
          </span>
        </div>

        {/* Quick View Floating Overlay on Hover */}
        <button
          onClick={() => onQuickView(artwork)}
          className="absolute inset-0 bg-gallery-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          aria-label={`Inspect ${artwork.title}`}
        >
          <span className="rounded-full px-4 py-2 bg-white/95 text-gallery-charcoal text-xs font-medium shadow-md inline-flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Maximize2 className="w-3.5 h-3.5 text-gallery-gold" />
            Inspect Masterpiece
          </span>
        </button>
      </div>

      {/* Curatorial Details Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onQuickView(artwork)}
            className="font-editorial text-2xl font-bold text-gallery-charcoal group-hover:text-gallery-gold-dark transition-colors cursor-pointer leading-snug"
          >
            {artwork.title}
          </h3>
          <p className="text-xs text-gallery-muted font-sans mt-1">
            By <span className="font-medium text-gallery-charcoal">{artwork.artist}</span>
          </p>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Dimensions: {artwork.dimensions}
          </p>
        </div>

        {/* Price & Acquisition Controls */}
        <div className="pt-4 border-t border-gallery-border/60 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] tracking-wider text-gallery-muted uppercase font-sans">
              Acquisition Value
            </span>
            <span className="font-sans text-xl font-semibold text-gallery-charcoal">
              {formatPrice(artwork.priceCents)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PillButton 
              variant="outline" 
              size="sm"
              onClick={() => onQuickView(artwork)}
              icon={<Eye className="w-3.5 h-3.5" />}
              className="px-3"
              aria-label="Inspect"
            >
              Inspect
            </PillButton>

            {isSold ? (
              <PillButton 
                variant="secondary" 
                size="sm"
                disabled
                icon={<Lock className="w-3.5 h-3.5" />}
                className="opacity-60 cursor-not-allowed"
              >
                In Collection
              </PillButton>
            ) : isReserved ? (
              <PillButton 
                variant="secondary" 
                size="sm"
                disabled
                icon={<Lock className="w-3.5 h-3.5" />}
                className="opacity-75 cursor-not-allowed text-amber-900 bg-amber-50"
              >
                Reserved
              </PillButton>
            ) : itemInCart ? (
              <PillButton 
                variant="primary" 
                size="sm"
                onClick={() => addToCart(artwork)}
                icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                className="bg-emerald-900 text-white"
              >
                In Cart
              </PillButton>
            ) : (
              <PillButton 
                variant="gold" 
                size="sm"
                onClick={() => addToCart(artwork)}
                icon={<ShoppingBag className="w-3.5 h-3.5" />}
              >
                Acquire
              </PillButton>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
