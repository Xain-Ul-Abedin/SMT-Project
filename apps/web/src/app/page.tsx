'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  Palette, 
  SlidersHorizontal, 
  ArrowRight, 
  Layers, 
  Server, 
  Database,
  CheckCircle2,
  ExternalLink,
  Brush,
  Filter,
  RefreshCw
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { Navbar } from '@/components/Navbar';
import { ArtworkCard } from '@/components/ArtworkCard';
import { ArtworkQuickViewModal } from '@/components/ArtworkQuickViewModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderTrackerModal } from '@/components/OrderTrackerModal';
import { ArtistSubmissionModal } from '@/components/ArtistSubmissionModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  artworksApi, 
  fetchHealth, 
  Artwork, 
  HealthResponse, 
  Order, 
  FALLBACK_ARTWORKS 
} from '@/lib/api';

const CATEGORIES = [
  'All',
  'Oil on Linen',
  'Acrylic on Canvas',
  'Bronze Sculpture',
  'Digital Fine Art',
  'Mixed Media'
];

export default function HomePage() {
  const { user, isAdmin, isArtist } = useAuth();
  const { itemCount, openCart } = useCart();

  // Telemetry & Catalog State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Interactive View States
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isArtistStudioOpen, setIsArtistStudioOpen] = useState(false);

  // Initial Telemetry & Catalog Load
  const fetchCatalog = async () => {
    setIsLoadingArtworks(true);
    try {
      const res = await artworksApi.getArtworks({
        medium: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchQuery.trim() || undefined,
      });
      setArtworks(res.data);
    } catch (err) {
      console.error('Failed to load artwork catalog', err);
      setArtworks(FALLBACK_ARTWORKS);
    } finally {
      setIsLoadingArtworks(false);
    }
  };

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [activeCategory, searchQuery]);

  // Handle Order Completed
  const handleOrderCompleted = (order: Order) => {
    setIsCheckoutOpen(false);
    setActiveOrder(order);
    fetchCatalog(); // Refresh catalog to update reserved status
  };

  // Handle Artist Submission Completed
  const handleSubmissionSuccess = (newArtwork: Artwork) => {
    fetchCatalog();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gallery-alabaster text-gallery-charcoal">
      
      {/* Dynamic Navigation Bar */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenArtistStudio={() => setIsArtistStudioOpen(true)}
      />

      {/* Main Exhibition Salon */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-16">
        
        {/* Architecture & Telemetry Card */}
        <section className="bg-white border border-gallery-border rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Decoupled N-Tier Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                <Server className="w-3 h-3" />
                Port 5000 REST Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Database className="w-3 h-3" />
                {health?.database.mode || 'Dual-Mode Resilient DB'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3" />
                Material You 50% Pills
              </span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-gallery-charcoal">
              Arts Gallery Monorepo • Zero-Cost Cloud Topology
            </h3>
            <p className="text-xs text-gallery-muted max-w-2xl font-sans">
              Autonomous microservice architecture connecting Next.js 15 App Router to Express.js REST API with integer cents precision invariants ($0.00/mo operating budget).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <Link href="/admin">
                <PillButton 
                  variant="gold" 
                  size="sm"
                  icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                >
                  Curator Workbench
                </PillButton>
              </Link>
            )}

            <a 
              href="http://localhost:5000/api/v1/health" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex"
            >
              <PillButton 
                variant="outline" 
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Inspect Health API
              </PillButton>
            </a>
          </div>
        </section>

        {/* Hero Editorial Showcase */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-2">
          <span className="text-xs tracking-[0.25em] text-gallery-gold uppercase font-semibold">
            Autumn 2026 Curated Salon
          </span>
          <h1 className="font-editorial text-5xl md:text-6xl font-light text-gallery-charcoal tracking-tight leading-[1.12]">
            Where Authentic Mastery Meets Discerning Collectors
          </h1>
          <p className="text-sm md:text-base text-gallery-muted font-sans font-light leading-relaxed max-w-2xl mx-auto">
            Experience authentic museum-grade original paintings, dimensional cast bronzes, and limited-run digital fine art from celebrated independent visual artists.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <PillButton 
              variant="primary" 
              size="lg"
              onClick={() => {
                const el = document.getElementById('catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="font-sans"
            >
              Explore Collection ({artworks.length})
            </PillButton>

            <PillButton 
              variant="outline" 
              size="lg"
              onClick={() => setIsArtistStudioOpen(true)}
              icon={<Brush className="w-4 h-4 text-gallery-gold" />}
              className="font-sans"
            >
              Artist Submission Studio
            </PillButton>
          </div>
        </section>

        {/* Curatorial Filter Chips & Live Search Controls */}
        <section id="catalog-grid" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gallery-border/80 pb-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-200 select-none whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-gallery-charcoal text-white shadow-xs'
                      : 'bg-white border border-gallery-border text-gallery-charcoal hover:border-gallery-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Telemetry Count & Refresh */}
            <div className="flex items-center gap-3 shrink-0 text-xs text-gallery-muted font-sans self-end sm:self-auto">
              <span>Displaying <strong>{artworks.length}</strong> masterworks</span>
              <button
                onClick={fetchCatalog}
                aria-label="Refresh Catalog"
                className="w-8 h-8 rounded-full border border-gallery-border hover:bg-slate-100 flex items-center justify-center text-gallery-charcoal transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingArtworks ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          {isLoadingArtworks ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-gallery-gold border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-gallery-muted font-sans">
                Curating exhibition catalog from gallery database...
              </p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="bg-white border border-gallery-border rounded-3xl p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-gallery-muted">
                <Palette className="w-8 h-8 text-gallery-muted/60" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-gallery-charcoal">
                No Masterpieces Found
              </h3>
              <p className="text-xs text-gallery-muted max-w-sm mx-auto font-sans">
                We could not find any artworks matching your active medium or search criteria.
              </p>
              <PillButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </PillButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((art) => (
                <ArtworkCard
                  key={art.id}
                  artwork={art}
                  onQuickView={(piece) => setSelectedArtwork(piece)}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Floating Cart Capsule for Mobile / Sticky UX */}
      {itemCount > 0 && (
        <aside className="fixed bottom-6 right-6 z-30 animate-in fade-in zoom-in-95 duration-200">
          <PillButton
            variant="gold"
            size="lg"
            onClick={openCart}
            icon={<ShoppingBag className="w-4 h-4 text-white" />}
            className="shadow-2xl ring-4 ring-white font-sans text-sm tracking-wide"
          >
            <span>Review Portfolio ({itemCount})</span>
          </PillButton>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-gallery-border bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gallery-muted font-sans">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-gallery-gold" />
            <span className="font-editorial text-base font-bold text-gallery-charcoal">
              Arts Gallery Web Application
            </span>
            <span>•</span>
            <span>Course Project (SMT-Project)</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Decoupled N-Tier Topology</span>
            <span>Zero-Cost $0.00/mo Hosting</span>
            <span>Celestial Material You 50% Pills</span>
          </div>
        </div>
      </footer>

      {/* Modals & Interactive Portals */}
      <ArtworkQuickViewModal 
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />

      <CartDrawer 
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderTrackerModal 
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      <ArtistSubmissionModal 
        isOpen={isArtistStudioOpen}
        onClose={() => setIsArtistStudioOpen(false)}
        onSubmissionSuccess={handleSubmissionSuccess}
      />

    </div>
  );
}
