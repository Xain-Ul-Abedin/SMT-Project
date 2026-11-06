'use client';

import React from 'react';
import { 
  X, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Frame, 
  Truck,
  Sparkles
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { useCart, FRAMING_OPTIONS } from '@/context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateFraming, 
    subtotalFormatted, 
    totalFormatted, 
    totalCents 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gallery-charcoal/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Slide-over Drawer Body */}
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gallery-border relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gallery-border flex items-center justify-between bg-gallery-alabaster">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gallery-charcoal flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4 text-gallery-gold" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-gallery-charcoal">
                Acquisition Portfolio
              </h3>
              <span className="text-[11px] text-gallery-muted font-sans block">
                {items.length} {items.length === 1 ? 'original piece' : 'original pieces'} selected
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close Portfolio"
            className="w-8 h-8 rounded-full border border-gallery-border hover:bg-slate-100 flex items-center justify-center text-gallery-charcoal transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content / Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gallery-border/60">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-gallery-muted">
                <ShoppingBag className="w-8 h-8 text-gallery-muted/60" />
              </div>
              <div className="space-y-1">
                <h4 className="font-editorial text-xl font-semibold text-gallery-charcoal">
                  Your portfolio is currently empty
                </h4>
                <p className="text-xs text-gallery-muted max-w-xs font-sans">
                  Browse the Autumn 2026 curated exhibition and select original masterpieces for acquisition.
                </p>
              </div>
              <PillButton 
                variant="outline" 
                size="sm"
                onClick={closeCart}
              >
                Browse Catalog
              </PillButton>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.artwork.id} className="pt-4 first:pt-0 space-y-3">
                <div className="flex gap-4">
                  {/* Artwork Image */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-black/5">
                    <img 
                      src={item.artwork.image} 
                      alt={item.artwork.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Artwork Title & Artist */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-editorial text-base font-bold text-gallery-charcoal truncate">
                        {item.artwork.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.artwork.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-gallery-muted font-sans">
                      {item.artwork.artist}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {item.artwork.medium}
                    </p>
                    <span className="font-sans text-xs font-semibold text-gallery-charcoal mt-1 block">
                      ${(item.artwork.priceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Framing Selection Capsule for this Item */}
                <div className="bg-slate-50 border border-gallery-border/80 rounded-2xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-gallery-charcoal flex items-center gap-1.5">
                      <Frame className="w-3 h-3 text-gallery-gold" />
                      Framing Specification
                    </span>
                    <span className="text-slate-500 font-sans font-medium">
                      {item.framing.priceCents > 0 ? `+$${item.framing.priceCents / 100}` : 'Complimentary'}
                    </span>
                  </div>

                  <select
                    value={item.framing.id}
                    onChange={(e) => updateFraming(item.artwork.id, e.target.value)}
                    className="w-full text-xs bg-white border border-gallery-border rounded-xl px-2.5 py-1.5 outline-hidden text-gallery-charcoal font-sans"
                  >
                    {FRAMING_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label} {f.priceCents > 0 ? `(+$${f.priceCents / 100})` : '($0)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gallery-border bg-gallery-alabaster space-y-4">
            
            {/* Guarantees */}
            <div className="space-y-1.5 text-[11px] text-gallery-muted">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-gallery-gold" />
                <span>Complimentary White-Glove Insured Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gallery-gold" />
                <span>Original Certificate of Authenticity Included</span>
              </div>
            </div>

            {/* Total Math Breakdown */}
            <div className="pt-2 border-t border-gallery-border/70 space-y-1">
              <div className="flex justify-between items-center text-xs text-gallery-muted">
                <span>Subtotal & Archival Framing</span>
                <span className="font-sans font-medium text-gallery-charcoal">{subtotalFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gallery-muted">
                <span>Insured Global Shipping</span>
                <span className="font-sans font-medium text-emerald-700">Complimentary ($0.00)</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold text-gallery-charcoal pt-2 border-t border-gallery-border/40">
                <span className="font-editorial text-lg">Total Acquisition</span>
                <span className="font-sans text-xl">{totalFormatted}</span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <PillButton 
              variant="gold" 
              size="lg"
              onClick={() => {
                closeCart();
                onProceedToCheckout();
              }}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full font-sans tracking-wide shadow-md"
            >
              Proceed to Secure Acquisition
            </PillButton>
          </div>
        )}

      </div>
    </div>
  );
}
