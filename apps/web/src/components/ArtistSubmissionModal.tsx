'use client';

import React, { useState } from 'react';
import { 
  X, 
  Brush, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { useAuth } from '@/context/AuthContext';
import { artworksApi, Artwork } from '@/lib/api';

interface ArtistSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionSuccess?: (artwork: Artwork) => void;
}

const PRESET_IMAGES = [
  { label: 'Oil Impressionism', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Brutalist Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Bronze Form', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Atmospheric Glaze', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80' },
];

export function ArtistSubmissionModal({ isOpen, onClose, onSubmissionSuccess }: ArtistSubmissionModalProps) {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    title: 'Nocturne in Azure VI',
    medium: 'Oil on Linen',
    dimensions: '36 x 48 inches (91 x 122 cm)',
    priceUSD: '2800',
    image: PRESET_IMAGES[0].url,
    description: 'An ethereal nocturnal landscape exploring atmospheric depth through multiple translucent glaze layers.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const priceCents = Math.round(parseFloat(formData.priceUSD) * 100);
      if (isNaN(priceCents) || priceCents <= 0) {
        throw new Error('Please enter a valid acquisition price.');
      }

      const authToken = token || 'demo-token-artist';
      const res = await artworksApi.createArtwork(
        {
          title: formData.title,
          medium: formData.medium,
          dimensions: formData.dimensions,
          priceCents,
          image: formData.image,
          description: formData.description,
          stock: 1,
        },
        authToken
      );

      setStatusMessage({
        type: 'success',
        text: 'Piece successfully submitted! It is now pending curatorial board review.',
      });

      onSubmissionSuccess?.(res.data);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Submission failed. Please check inputs and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gallery-charcoal/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="bg-white rounded-3xl border border-gallery-border max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Submission Modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-gallery-border hover:bg-slate-100 flex items-center justify-center text-gallery-charcoal transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gallery-border bg-gallery-alabaster">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.25em] text-gallery-gold font-semibold uppercase flex items-center gap-1.5">
              <Brush className="w-3.5 h-3.5 text-gallery-gold" />
              Artist Studio Portal
            </span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-gallery-charcoal">
            Submit Original Masterwork
          </h2>
          <p className="text-xs text-gallery-muted font-sans mt-1">
            Submissions undergo curatorial evaluation before exhibition and COA issuance.
          </p>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div className={`mx-6 sm:mx-8 mt-6 p-4 rounded-2xl flex items-start gap-3 text-xs ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            )}
            <p className="font-sans font-medium">{statusMessage.text}</p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs">
          
          <div>
            <label className="block text-gallery-muted mb-1 font-medium">Masterwork Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gallery-muted mb-1 font-medium">Fine Art Medium</label>
              <select
                value={formData.medium}
                onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal font-sans"
              >
                <option value="Oil on Linen">Oil on Linen</option>
                <option value="Acrylic on Canvas">Acrylic on Canvas</option>
                <option value="Bronze Sculpture">Bronze Sculpture</option>
                <option value="Digital Fine Art">Digital Fine Art</option>
                <option value="Mixed Media">Mixed Media</option>
                <option value="Watercolor & Gouache">Watercolor & Gouache</option>
              </select>
            </div>

            <div>
              <label className="block text-gallery-muted mb-1 font-medium">Acquisition Price ($ USD)</label>
              <input 
                type="number" 
                required
                min="50"
                step="10"
                value={formData.priceUSD}
                onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
                className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-gallery-muted mb-1 font-medium">Physical Dimensions</label>
            <input 
              type="text" 
              required
              placeholder="e.g. 36 x 48 inches (91 x 122 cm)"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal font-sans"
            />
          </div>

          <div>
            <label className="block text-gallery-muted mb-1 font-medium">High-Resolution Image URL</label>
            <input 
              type="url" 
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-50 border border-gallery-border rounded-xl px-3.5 py-2.5 outline-hidden focus:border-gallery-charcoal font-sans"
            />

            {/* Quick Preset Selector */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-gallery-muted font-medium shrink-0">Sample Presets:</span>
              {PRESET_IMAGES.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className="rounded-full px-2.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-gallery-charcoal shrink-0 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gallery-muted mb-1 font-medium">Artist Statement & Curatorial Notes</label>
            <textarea 
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-gallery-border rounded-xl p-3 outline-hidden focus:border-gallery-charcoal font-sans resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gallery-border/80 flex items-center justify-end gap-3">
            <PillButton 
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </PillButton>

            <PillButton 
              type="submit"
              variant="gold"
              size="md"
              disabled={isSubmitting}
              icon={isSubmitting ? undefined : <Brush className="w-4 h-4" />}
              className="font-sans tracking-wide shadow-md"
            >
              {isSubmitting ? 'Submitting to Board...' : 'Submit to Curators'}
            </PillButton>
          </div>

        </form>

      </div>
    </div>
  );
}
