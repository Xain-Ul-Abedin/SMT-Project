'use client';

import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, Order } from '@/lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export function CheckoutModal({ isOpen, onClose, onOrderCompleted }: CheckoutModalProps) {
  const { items, totalFormatted, clearCart } = useCart();
  const { user, token } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Arthur Pendelton',
    street: '742 Evergreen Terrace, Suite 400',
    city: 'New York',
    postalCode: '10021',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'STRIPE_CARD' | 'CASH_ON_DELIVERY'>('STRIPE_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map(item => ({
          artworkId: item.artwork.id,
          framing: item.framing.id,
          framingPriceCents: item.framing.priceCents,
        })),
        shippingAddress,
        paymentMethod,
      };

      const authToken = token || 'demo-collector-token';
      const res = await ordersApi.createOrder(orderPayload, authToken);

      clearCart();
      onOrderCompleted(res.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Acquisition order failed to process.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gallery-charcoal/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="bg-white rounded-3xl border border-gallery-border max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Checkout"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-gallery-border hover:bg-slate-100 flex items-center justify-center text-gallery-charcoal transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-gallery-border bg-gallery-alabaster">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.25em] text-gallery-gold font-semibold uppercase">
              Secure Fine Art Acquisition
            </span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-gallery-charcoal">
            Private Collection Checkout
          </h2>
          <p className="text-xs text-gallery-muted font-sans mt-1">
            Original one-of-a-kind physical masterworks are immediately reserved upon confirmation.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Acquisition Invariant Notice</span>
              <p className="mt-0.5 font-sans">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
          
          {/* Section 1: Collector & Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-gallery-charcoal flex items-center gap-2">
              <Truck className="w-4 h-4 text-gallery-gold" />
              White-Glove Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gallery-muted mb-1 font-medium">Recipient / Collector Name</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal transition-colors font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gallery-muted mb-1 font-medium">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-gallery-muted mb-1 font-medium">City</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-gallery-muted mb-1 font-medium">Postal / ZIP Code</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal transition-colors font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gallery-muted mb-1 font-medium">Country</label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal transition-colors font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Settlement Protocol */}
          <div className="space-y-4 pt-4 border-t border-gallery-border/80">
            <h3 className="font-editorial text-xl font-bold text-gallery-charcoal flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gallery-gold" />
              Settlement Protocol
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('STRIPE_CARD')}
                className={`rounded-2xl p-4 text-left border transition-all ${
                  paymentMethod === 'STRIPE_CARD'
                    ? 'border-gallery-charcoal bg-slate-50 shadow-xs'
                    : 'border-gallery-border hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gallery-charcoal">Card Authorization</span>
                  <CreditCard className="w-4 h-4 text-gallery-gold" />
                </div>
                <p className="text-[11px] text-slate-500 font-sans">
                  Direct encrypted card settlement with zero collector fees.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`rounded-2xl p-4 text-left border transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-gallery-charcoal bg-slate-50 shadow-xs'
                    : 'border-gallery-border hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gallery-charcoal">Gallery Handover / Wire</span>
                  <Truck className="w-4 h-4 text-gallery-gold" />
                </div>
                <p className="text-[11px] text-slate-500 font-sans">
                  Settlement upon private courier inspection or wire escrow.
                </p>
              </button>
            </div>

            {paymentMethod === 'STRIPE_CARD' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-gallery-border space-y-2 text-xs">
                <label className="block text-gallery-muted font-medium">Encrypted Card Reference</label>
                <div className="flex items-center bg-white border border-gallery-border rounded-xl px-3.5 py-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input 
                    type="text" 
                    readOnly 
                    value={cardNumber} 
                    className="w-full bg-transparent outline-hidden font-mono text-slate-600 text-xs"
                  />
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                    Test Mode Verified
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Summary & Order Execution */}
          <div className="pt-4 border-t border-gallery-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] tracking-wider text-gallery-muted uppercase font-sans">
                Total Acquisition Obligation
              </span>
              <span className="font-sans text-2xl font-bold text-gallery-charcoal">
                {totalFormatted}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <PillButton 
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto"
              >
                Cancel
              </PillButton>

              <PillButton 
                type="submit"
                variant="gold"
                size="md"
                disabled={isSubmitting}
                icon={isSubmitting ? undefined : <ShieldCheck className="w-4 h-4" />}
                className="w-1/2 sm:w-auto font-sans tracking-wide shadow-md"
              >
                {isSubmitting ? 'Confirming Acquisition...' : 'Confirm Acquisition'}
              </PillButton>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
