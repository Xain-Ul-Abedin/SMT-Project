'use client';

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { Order } from '@/lib/api';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
}

const MILESTONES = [
  {
    key: 'PENDING',
    title: 'Acquisition Confirmed',
    description: 'Inventory locked & transaction authorized.',
    icon: Clock,
  },
  {
    key: 'IN_CURATION',
    title: 'Archival Framing & Inspection',
    description: 'Curatorial master inspection and COA sealing.',
    icon: Package,
  },
  {
    key: 'DISPATCHED',
    title: 'White-Glove Courier Transit',
    description: 'Insured temperature-controlled transport.',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    title: 'Private Collection Delivery',
    description: 'Handed over and verified with collector.',
    icon: Home,
  },
];

export function OrderTrackerModal({ order, onClose }: OrderTrackerModalProps) {
  if (!order) return null;

  const currentStepIndex = MILESTONES.findIndex(m => m.key === order.status);
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
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
          aria-label="Close Order Tracking"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-gallery-border hover:bg-slate-100 flex items-center justify-center text-gallery-charcoal transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gallery-border bg-emerald-50/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Acquisition Confirmed
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID: {order.id}
            </span>
          </div>

          <h2 className="font-editorial text-3xl font-bold text-gallery-charcoal mt-2">
            Provenance & Courier Dispatch
          </h2>
          <p className="text-xs text-gallery-muted font-sans mt-1">
            Your physical fine art piece is now permanently reserved in the gallery archives.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Milestone Stepper */}
          <div className="space-y-6">
            <span className="text-[10px] tracking-wider text-gallery-muted uppercase font-semibold block">
              Curatorial Fulfillment Stepper
            </span>

            <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-4">
              {MILESTONES.map((milestone, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const IconComponent = milestone.icon;

                return (
                  <div key={milestone.key} className="relative group">
                    {/* Stepper Node Orb */}
                    <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isCurrent 
                        ? 'bg-gallery-gold text-white ring-4 ring-gallery-gold/20' 
                        : isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${
                          isCompleted ? 'text-gallery-charcoal' : 'text-slate-400'
                        }`}>
                          {milestone.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gallery-gold/15 text-gallery-gold-dark border border-gallery-gold/30">
                            Active Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-sans">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Reference Capsule */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-gallery-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-gallery-muted text-[10px] uppercase tracking-wider block font-medium">
                Courier Transit Reference
              </span>
              <span className="font-mono font-semibold text-gallery-charcoal text-sm">
                {order.trackingNumber || 'PENDING-DISPATCH-MANIFEST'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-gallery-border text-gallery-charcoal shadow-xs">
                White-Glove Insured
              </span>
            </div>
          </div>

          {/* Acquired Works Breakdown */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] tracking-wider text-gallery-muted uppercase font-semibold block">
              Portfolio Items ({order.items.length})
            </span>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gallery-border/80 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-black/5 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-editorial text-sm font-bold text-gallery-charcoal block">
                        {item.title}
                      </span>
                      <span className="text-slate-500 font-sans text-[11px]">
                        By {item.artist} {item.framing ? `• ${item.framing}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-sans font-semibold text-gallery-charcoal">
                    {formatPrice(item.priceCents + (item.framingPriceCents || 0))}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gallery-border/80 flex justify-between items-center text-sm font-bold text-gallery-charcoal">
              <span>Total Settlement</span>
              <span className="font-sans text-lg">{formatPrice(order.totalCents)}</span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex justify-end">
            <PillButton 
              variant="primary" 
              size="md"
              onClick={onClose}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto font-sans"
            >
              Return to Exhibition
            </PillButton>
          </div>

        </div>

      </div>
    </div>
  );
}
