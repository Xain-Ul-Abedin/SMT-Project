'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  Frame, 
  Ruler, 
  Layers, 
  Info,
  Calendar
} from 'lucide-react';
import { Artwork } from '@/lib/api';
import { PillButton } from '@/components/ui/PillButton';
import { FRAMING_OPTIONS, useCart } from '@/context/CartContext';

interface ArtworkQuickViewModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export function ArtworkQuickViewModal({ artwork, onClose }: ArtworkQuickViewModalProps) {
  const { addToCart, isInCart } = useCart();
  const [selectedFramingId, setSelectedFramingId] = useState('UNFRAMED');

  if (!artwork) return null;

  const selectedFraming = FRAMING_OPTIONS.find(f => f.id === selectedFramingId) || FRAMING_OPTIONS[0];
  const totalPieceCents = artwork.priceCents + selectedFraming.priceCents;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const handleAcquire = () => {
    addToCart(artwork, selectedFramingId);
    onClose();
  };

  const inCart = isInCart(artwork.id);
  const isAvailable = artwork.status === 'AVAILABLE' && artwork.stock > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gallery-charcoal/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="bg-white rounded-3xl border border-gallery-border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Circular Orb */}
        <button
          onClick={onClose}
          aria-label="Close Inspection Modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-gallery-border flex items-center justify-center text-gallery-charcoal hover:bg-gallery-charcoal hover:text-white transition-all shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Visual Artwork Presentation */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[320px] md:min-h-full flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gallery-border/80">
          <div className="relative max-w-full max-h-[460px] overflow-hidden rounded-2xl shadow-lg border border-black/5">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-contain max-h-[440px]"
            />
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] text-gallery-muted bg-white/90 backdrop-blur-xs rounded-full px-4 py-1.5 shadow-xs">
            <span className="font-medium text-gallery-charcoal">Original 1 of 1</span>
            <span>Archival Conservation Grade</span>
          </div>
        </div>

        {/* Right Column: Curatorial Details & Custom Framing */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Curatorial Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full px-3 py-1 bg-slate-100 text-[11px] font-medium text-gallery-charcoal">
                  {artwork.medium}
                </span>
                {artwork.certificateOfAuthenticity?.issued && (
                  <span className="rounded-full px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gallery-gold" />
                    Verified COA
                  </span>
                )}
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-gallery-charcoal leading-tight">
                {artwork.title}
              </h2>
              <p className="text-sm text-gallery-muted font-sans mt-1">
                Created by <span className="font-medium text-gallery-charcoal">{artwork.artist}</span>
              </p>
            </div>

            {/* Dimensional Specifications */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-gallery-border/70 text-xs">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gallery-gold shrink-0" />
                <div>
                  <span className="block text-gallery-muted text-[10px] uppercase tracking-wider">Dimensions</span>
                  <span className="font-medium text-gallery-charcoal">{artwork.dimensions}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gallery-gold shrink-0" />
                <div>
                  <span className="block text-gallery-muted text-[10px] uppercase tracking-wider">Provenance</span>
                  <span className="font-medium text-gallery-charcoal">Direct Artist Atelier</span>
                </div>
              </div>
            </div>

            {/* Curatorial Notes & Artist Statement */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-gallery-muted font-semibold block">
                Curatorial Note
              </span>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                {artwork.description || 'Masterwork executed with meticulous hand techniques, embodying authentic spatial depth and chromatic harmony.'}
              </p>
            </div>

            {/* Custom Archival Framing Selection */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-gallery-muted font-semibold flex items-center gap-1.5">
                  <Frame className="w-3.5 h-3.5 text-gallery-gold" />
                  Archival Framing Service
                </span>
                <span className="text-[11px] text-gallery-gold font-medium">
                  {selectedFraming.priceCents > 0 ? `+${formatPrice(selectedFraming.priceCents)}` : 'Complimentary'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {FRAMING_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFramingId(f.id)}
                    className={`rounded-2xl p-2.5 text-left border transition-all text-xs flex items-center justify-between ${
                      selectedFramingId === f.id
                        ? 'border-gallery-charcoal bg-slate-50 shadow-xs'
                        : 'border-gallery-border hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-gallery-charcoal block">{f.label}</span>
                      <span className="text-[10px] text-slate-500 font-sans block">{f.description}</span>
                    </div>
                    <span className="text-xs font-semibold text-gallery-charcoal shrink-0 ml-2">
                      {f.priceCents === 0 ? '$0' : `+$${f.priceCents / 100}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Acquisition Footer */}
          <div className="pt-4 border-t border-gallery-border/80 flex items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] tracking-wider text-gallery-muted uppercase font-sans">
                Total Acquisition
              </span>
              <span className="font-sans text-2xl font-bold text-gallery-charcoal">
                {formatPrice(totalPieceCents)}
              </span>
            </div>

            <div>
              {inCart ? (
                <PillButton 
                  variant="primary" 
                  size="md"
                  onClick={onClose}
                  icon={<Check className="w-4 h-4 text-emerald-400" />}
                  className="bg-emerald-900 text-white"
                >
                  View in Cart
                </PillButton>
              ) : isAvailable ? (
                <PillButton 
                  variant="gold" 
                  size="md"
                  onClick={handleAcquire}
                  icon={<ShoppingBag className="w-4 h-4" />}
                >
                  Acquire Piece
                </PillButton>
              ) : (
                <PillButton 
                  variant="secondary" 
                  size="md"
                  disabled
                  className="opacity-70 cursor-not-allowed"
                >
                  Unavailable
                </PillButton>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
