'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Search, 
  ShoppingBag, 
  UserCheck, 
  ShieldCheck, 
  Brush, 
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAdminWorkbench?: () => void;
  onOpenArtistStudio?: () => void;
}

export function Navbar({
  searchQuery = '',
  onSearchChange,
  onOpenAdminWorkbench,
  onOpenArtistStudio,
}: NavbarProps) {
  const { user, isAdmin, isArtist, switchDemoUser, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-gallery-alabaster/90 border-b border-gallery-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Studio Identity */}
        <Link href="/" className="flex items-center gap-3.5 group select-none">
          <div className="w-11 h-11 rounded-full bg-gallery-charcoal flex items-center justify-center text-white shadow-sm group-hover:bg-gallery-gold-dark transition-colors">
            <Palette className="w-5 h-5 text-gallery-gold group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-gallery-charcoal block leading-none">
              ARTS GALLERY
            </span>
            <span className="text-[10px] tracking-[0.25em] text-gallery-gold font-medium uppercase mt-1 block">
              Curated Atelier & Salon
            </span>
          </div>
        </Link>

        {/* Center Search Capsule */}
        <div className="hidden md:flex items-center bg-white border border-gallery-border rounded-full px-4 py-2 w-72 lg:w-96 shadow-xs focus-within:border-gallery-charcoal focus-within:shadow-sm transition-all">
          <Search className="w-4 h-4 text-gallery-muted mr-2.5 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search artists, mediums, styles..."
            className="bg-transparent text-xs w-full outline-hidden text-gallery-charcoal placeholder:text-gallery-muted/70 font-sans"
          />
        </div>

        {/* Right Navigation & Interactive Action Capsules */}
        <div className="flex items-center gap-2.5">
          
          {/* Admin Workbench Link */}
          {isAdmin && (
            <Link href="/admin">
              <PillButton 
                variant="outline" 
                size="sm"
                icon={<SlidersHorizontal className="w-3.5 h-3.5 text-gallery-gold" />}
                className="hidden sm:inline-flex border-gallery-gold/40 hover:border-gallery-gold bg-gallery-gold/5"
              >
                Curator Workbench
              </PillButton>
            </Link>
          )}

          {/* Artist Studio Trigger */}
          {isArtist && (
            <button
              onClick={onOpenArtistStudio}
              className="hidden sm:inline-flex rounded-full items-center gap-1.5 px-4 py-2 text-xs font-medium border border-gallery-border hover:border-gallery-charcoal text-gallery-charcoal bg-white transition-all shadow-xs"
            >
              <Brush className="w-3.5 h-3.5 text-gallery-gold" />
              <span>Submit Piece</span>
            </button>
          )}

          {/* Multi-Tenant Demo Persona Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="rounded-full inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-white border border-gallery-border hover:border-gallery-charcoal text-gallery-charcoal shadow-xs transition-all select-none"
            >
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-gallery-gold" />
                ) : isArtist ? (
                  <Brush className="w-3.5 h-3.5 text-gallery-gold" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-gallery-muted" />
                )}
              </div>
              <span className="max-w-[110px] truncate font-sans">
                {user ? user.name.split(' ')[0] : 'Sign In'} ({user?.role || 'visitor'})
              </span>
              <ChevronDown className="w-3 h-3 text-gallery-muted" />
            </button>

            {/* Persona Dropdown Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border border-gallery-border shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gallery-border/60">
                  <span className="text-[10px] tracking-wider text-gallery-muted uppercase font-semibold block">
                    Switch Authentic Role
                  </span>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Test full multi-tenant capabilities
                  </p>
                </div>

                <div className="py-2 space-y-1">
                  {/* Collector Option */}
                  <button
                    onClick={() => {
                      switchDemoUser('collector');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-full text-xs flex items-center justify-between transition-colors ${
                      user?.role === 'customer' 
                        ? 'bg-gallery-charcoal text-white font-medium' 
                        : 'hover:bg-slate-100 text-gallery-charcoal'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-gallery-gold" />
                      <span>Collector (Arthur)</span>
                    </div>
                    <span className="text-[10px] opacity-70">Buyer</span>
                  </button>

                  {/* Artist Option */}
                  <button
                    onClick={() => {
                      switchDemoUser('artist');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-full text-xs flex items-center justify-between transition-colors ${
                      user?.role === 'artist' 
                        ? 'bg-gallery-charcoal text-white font-medium' 
                        : 'hover:bg-slate-100 text-gallery-charcoal'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Brush className="w-3.5 h-3.5 text-gallery-gold" />
                      <span>Artist (Elena)</span>
                    </div>
                    <span className="text-[10px] opacity-70">Creator</span>
                  </button>

                  {/* Admin Option */}
                  <button
                    onClick={() => {
                      switchDemoUser('admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-full text-xs flex items-center justify-between transition-colors ${
                      user?.role === 'admin' 
                        ? 'bg-gallery-charcoal text-white font-medium' 
                        : 'hover:bg-slate-100 text-gallery-charcoal'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-gallery-gold" />
                      <span>Curator (Victoria)</span>
                    </div>
                    <span className="text-[10px] opacity-70">Admin</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-gallery-border/60">
                  <button
                    onClick={() => {
                      logout();
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-full text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Clear Active Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Capsule PillButton */}
          <PillButton 
            variant="gold" 
            size="sm"
            onClick={openCart}
            icon={<ShoppingBag className="w-3.5 h-3.5 text-white" />}
            className="relative font-sans shadow-sm"
          >
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-gallery-charcoal text-[10px] font-bold">
                {itemCount}
              </span>
            )}
          </PillButton>

        </div>
      </div>
    </header>
  );
}
