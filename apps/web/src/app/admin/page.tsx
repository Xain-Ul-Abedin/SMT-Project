'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Package, 
  Truck, 
  Layers, 
  RefreshCw, 
  Eye, 
  ExternalLink,
  SlidersHorizontal,
  Home,
  Clock,
  Sparkles
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { useAuth } from '@/context/AuthContext';
import { curationApi, ordersApi, Artwork, Order } from '@/lib/api';

export default function AdminWorkbenchPage() {
  const { user, token, isAdmin, switchDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'curation' | 'orders'>('curation');

  // State
  const [pendingArtworks, setPendingArtworks] = useState<Artwork[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Load Data
  const loadAdminData = async () => {
    setIsLoading(true);
    setActionMessage(null);
    const authToken = token || 'demo-token-admin';

    try {
      // Load pending submissions
      const curationRes = await curationApi.getPendingArtworks(authToken).catch(() => ({
        success: true,
        data: [
          {
            id: 'ART-901',
            title: 'Nocturne in Azure VI',
            artist: 'Elena Rostova',
            medium: 'Oil on Linen',
            dimensions: '36 x 48 inches (91 x 122 cm)',
            priceCents: 280000,
            priceFormatted: '$2,800.00',
            image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
            description: 'Exploration of classical indigo glazes depicting atmospheric oceanic stillness.',
            status: 'PENDING_APPROVAL' as const,
            stock: 1,
          }
        ],
        count: 1
      }));
      setPendingArtworks(curationRes.data);

      // Load all orders
      const ordersRes = await ordersApi.getAllOrders(authToken).catch(() => ({
        success: true,
        data: [
          {
            id: 'ORD-1793957966644-405',
            userId: 'USR-COLLECTOR',
            customerName: 'Arthur Pendelton',
            items: [
              {
                artworkId: 'ART-001',
                title: 'Solitude in Cobalt',
                artist: 'Elena Rostova',
                priceCents: 240000,
                image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
                framing: 'Handcrafted White Oak & UV Glass',
                framingPriceCents: 22000,
              }
            ],
            subtotalCents: 262000,
            shippingCents: 0,
            totalCents: 262000,
            status: 'IN_CURATION' as const,
            shippingAddress: {
              fullName: 'Arthur Pendelton',
              street: '742 Evergreen Terrace',
              city: 'New York',
              postalCode: '10021',
              country: 'United States',
            },
            paymentMethod: 'STRIPE_CARD' as const,
            isPaid: true,
            trackingNumber: 'TRK-GALLERY-US-9421',
          }
        ],
        count: 1
      }));
      setAllOrders(ordersRes.data);
    } catch (err: any) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  // Curation Action: Approve Artwork
  const handleApprove = async (artworkId: string) => {
    const authToken = token || 'demo-token-admin';
    try {
      await curationApi.approveArtwork(artworkId, authToken);
      setActionMessage(`[PASS] Artwork ${artworkId} approved with Certificate of Authenticity. Now available in salon.`);
      setPendingArtworks(prev => prev.filter(a => a.id !== artworkId));
    } catch (err: any) {
      setActionMessage(`[INFO] Offline simulation: Artwork ${artworkId} approved.`);
      setPendingArtworks(prev => prev.filter(a => a.id !== artworkId));
    }
  };

  // Curation Action: Reject Artwork
  const handleReject = async (artworkId: string) => {
    const reason = prompt('Please specify curatorial rejection rationale:', 'Does not meet seasonal theme criteria.');
    if (!reason) return;

    const authToken = token || 'demo-token-admin';
    try {
      await curationApi.rejectArtwork(artworkId, reason, authToken);
      setActionMessage(`[PASS] Artwork ${artworkId} rejected.`);
      setPendingArtworks(prev => prev.filter(a => a.id !== artworkId));
    } catch (err: any) {
      setActionMessage(`[INFO] Offline simulation: Artwork ${artworkId} rejected.`);
      setPendingArtworks(prev => prev.filter(a => a.id !== artworkId));
    }
  };

  // Order Fulfillment: Advance Status
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string, defaultTracking?: string) => {
    let trackingNumber = defaultTracking;
    if (nextStatus === 'DISPATCHED') {
      const code = prompt('Enter White-Glove Courier Tracking Code:', defaultTracking || 'TRK-GALLERY-US-8820');
      if (!code) return;
      trackingNumber = code;
    }

    const authToken = token || 'demo-token-admin';
    try {
      await ordersApi.updateOrderStatus(orderId, { status: nextStatus, trackingNumber }, authToken);
      setActionMessage(`[PASS] Order ${orderId} progressed to ${nextStatus}.`);
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus as any, trackingNumber } : o));
    } catch (err: any) {
      setActionMessage(`[INFO] Offline simulation: Order ${orderId} progressed to ${nextStatus}.`);
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus as any, trackingNumber } : o));
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-gallery-alabaster flex flex-col justify-between">
      
      {/* Admin Atelier Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-gallery-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <button 
                aria-label="Return to Salon"
                className="w-10 h-10 rounded-full border border-gallery-border hover:bg-slate-100 flex items-center justify-center text-gallery-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl font-bold tracking-tight text-gallery-charcoal">
                  Curatorial Atelier
                </span>
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-gallery-gold/15 text-gallery-gold-dark border border-gallery-gold/30">
                  Admin Authority
                </span>
              </div>
              <span className="text-[10px] tracking-[0.2em] text-gallery-muted uppercase font-sans block">
                Verification & Fulfillment Control Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAdmin && (
              <PillButton
                variant="outline"
                size="sm"
                onClick={() => switchDemoUser('admin')}
                icon={<ShieldCheck className="w-3.5 h-3.5 text-gallery-gold" />}
              >
                Assume Admin Role
              </PillButton>
            )}

            <button
              onClick={loadAdminData}
              disabled={isLoading}
              aria-label="Refresh Data"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gallery-charcoal transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        
        {/* Banner Alert */}
        {actionMessage && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs font-sans flex items-center justify-between shadow-md">
            <span>{actionMessage}</span>
            <button 
              onClick={() => setActionMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs Capsules */}
        <section className="flex items-center gap-3 border-b border-gallery-border pb-4">
          <button
            onClick={() => setActiveTab('curation')}
            className={`rounded-full px-6 py-2.5 text-xs font-medium inline-flex items-center gap-2 transition-all select-none ${
              activeTab === 'curation'
                ? 'bg-gallery-charcoal text-white shadow-xs'
                : 'bg-white border border-gallery-border text-gallery-charcoal hover:border-gallery-charcoal'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gallery-gold" />
            <span>Curatorial Queue</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-gallery-charcoal font-bold">
              {pendingArtworks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`rounded-full px-6 py-2.5 text-xs font-medium inline-flex items-center gap-2 transition-all select-none ${
              activeTab === 'orders'
                ? 'bg-gallery-charcoal text-white shadow-xs'
                : 'bg-white border border-gallery-border text-gallery-charcoal hover:border-gallery-charcoal'
            }`}
          >
            <Truck className="w-4 h-4 text-gallery-gold" />
            <span>Fulfillment Pipeline</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-gallery-charcoal font-bold">
              {allOrders.length}
            </span>
          </button>
        </section>

        {/* Tab 1: Curatorial Submissions Queue */}
        {activeTab === 'curation' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-gallery-charcoal">
                  Submissions Awaiting Curatorial Review
                </h3>
                <p className="text-xs text-gallery-muted font-sans mt-0.5">
                  Approve pieces into the public exhibition catalog and generate digital Certificates of Authenticity.
                </p>
              </div>
            </div>

            {pendingArtworks.length === 0 ? (
              <div className="bg-white border border-gallery-border rounded-3xl p-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-editorial text-xl font-bold text-gallery-charcoal">
                  Queue Pristine & Clean
                </h4>
                <p className="text-xs text-gallery-muted font-sans max-w-sm mx-auto">
                  All submitted pieces have been reviewed and cataloged into the active autumn exhibition.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingArtworks.map((art) => (
                  <div 
                    key={art.id} 
                    className="bg-white border border-gallery-border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 bg-slate-100">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                      <span className="absolute top-4 left-4 rounded-full px-3 py-1 bg-white/95 backdrop-blur-xs text-[11px] font-medium text-gallery-charcoal">
                        {art.medium}
                      </span>
                      <span className="absolute top-4 right-4 rounded-full px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                        PENDING_APPROVAL
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-editorial text-2xl font-bold text-gallery-charcoal">
                          {art.title}
                        </h4>
                        <p className="text-xs text-gallery-muted font-sans mt-1">
                          Artist: <span className="font-medium text-gallery-charcoal">{art.artist}</span>
                        </p>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          Dimensions: {art.dimensions}
                        </p>
                        <p className="text-xs text-slate-600 font-sans mt-2 line-clamp-3">
                          {art.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gallery-border/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gallery-muted uppercase tracking-wider block font-sans">
                            Requested Price
                          </span>
                          <span className="font-sans text-xl font-bold text-gallery-charcoal">
                            {formatPrice(art.priceCents)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReject(art.id)}
                            className="rounded-full w-9 h-9 border border-rose-200 hover:bg-rose-50 text-rose-700 flex items-center justify-center transition-colors"
                            title="Reject Submission"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>

                          <PillButton
                            variant="gold"
                            size="sm"
                            onClick={() => handleApprove(art.id)}
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Approve with COA
                          </PillButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Orders & Logistics Pipeline */}
        {activeTab === 'orders' && (
          <section className="space-y-6">
            <div>
              <h3 className="font-editorial text-2xl font-bold text-gallery-charcoal">
                Private Collector Acquisitions & Logistics
              </h3>
              <p className="text-xs text-gallery-muted font-sans mt-0.5">
                Manage framing verification, courier dispatch manifests, and delivery completions.
              </p>
            </div>

            <div className="space-y-4">
              {allOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white border border-gallery-border rounded-3xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Order & Recipient Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-gallery-charcoal bg-slate-100 px-3 py-1 rounded-full">
                        {order.id}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'DISPATCHED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        Stage: {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-gallery-muted font-sans space-y-0.5">
                      <p>
                        Collector: <span className="font-medium text-gallery-charcoal">{order.shippingAddress?.fullName || 'Arthur Pendelton'}</span> ({order.shippingAddress?.city}, {order.shippingAddress?.country})
                      </p>
                      <p>
                        Tracking Reference: <span className="font-mono font-medium text-gallery-charcoal">{order.trackingNumber || 'Awaiting Dispatch Code'}</span>
                      </p>
                    </div>

                    {/* Acquired Works in Order */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-gallery-border rounded-full px-3 py-1 text-xs">
                          <span className="font-medium text-gallery-charcoal">{item.title}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{item.framing || 'Unframed'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial & Status Progression Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:border-l lg:border-gallery-border lg:pl-6 shrink-0">
                    <div>
                      <span className="block text-[10px] text-gallery-muted uppercase tracking-wider font-sans">
                        Settled Value
                      </span>
                      <span className="font-sans text-xl font-bold text-gallery-charcoal">
                        {formatPrice(order.totalCents)}
                      </span>
                    </div>

                    {/* Progression Actions */}
                    <div className="flex items-center gap-2">
                      {order.status === 'PENDING' && (
                        <PillButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, 'IN_CURATION')}
                          icon={<Package className="w-3.5 h-3.5 text-gallery-gold" />}
                        >
                          To Archival Framing
                        </PillButton>
                      )}

                      {order.status === 'IN_CURATION' && (
                        <PillButton
                          variant="gold"
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, 'DISPATCHED')}
                          icon={<Truck className="w-3.5 h-3.5" />}
                        >
                          Dispatch Courier
                        </PillButton>
                      )}

                      {order.status === 'DISPATCHED' && (
                        <PillButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          className="bg-emerald-900 text-white"
                        >
                          Mark Delivered & Sold
                        </PillButton>
                      )}

                      {order.status === 'DELIVERED' && (
                        <span className="rounded-full px-4 py-2 bg-slate-100 text-slate-500 text-xs font-medium inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Acquisition Finalized
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gallery-border bg-white py-8 mt-16 text-center text-xs text-gallery-muted font-sans">
        <span>Arts Gallery Atelier Governance • SMT-Project Monorepo • Zero-Cost Cloud Architecture</span>
      </footer>

    </div>
  );
}
