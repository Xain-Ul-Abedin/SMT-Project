/**
 * Arts Gallery REST API Client
 * Decoupled client targeting Express REST API (default http://localhost:5000/api/v1)
 * Adheres strictly to Zero-Cost ($0/mo) architecture and resilient dual-mode data fallback.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'customer' | 'artist' | 'admin';
  avatar?: string;
  artistStatement?: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  medium: string;
  dimensions: string;
  priceCents: number;
  priceUSD?: number;
  priceFormatted?: string;
  image: string;
  description: string;
  status: 'PENDING_APPROVAL' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';
  stock: number;
  featured?: boolean;
  certificateOfAuthenticity?: {
    issued: boolean;
    certificateNumber?: string;
    issueDate?: string;
  };
  createdAt?: string;
}

export interface OrderItem {
  artworkId: string;
  title: string;
  artist: string;
  priceCents: number;
  image: string;
  framing?: string;
  framingPriceCents?: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  totalUSD?: number;
  totalFormatted?: string;
  status: 'PENDING' | 'IN_CURATION' | 'DISPATCHED' | 'DELIVERED';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'STRIPE_CARD' | 'CASH_ON_DELIVERY';
  isPaid: boolean;
  trackingNumber?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  count?: number;
  total?: number;
}

export interface HealthResponse {
  success: boolean;
  service: string;
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    mode: string;
    status: string;
    host: string;
  };
  architecture: {
    topology: string;
    costMonthly: string;
    framework: string;
  };
}

// Fallback seed artworks for instant preview when API is cold-starting
export const FALLBACK_ARTWORKS: Artwork[] = [
  {
    id: 'ART-001',
    title: 'Solitude in Cobalt',
    artist: 'Elena Rostova',
    medium: 'Oil on Linen',
    dimensions: '36 x 48 inches (91 x 122 cm)',
    priceCents: 240000,
    priceFormatted: '$2,400.00',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    description: 'A contemplative exploration of architectural indigo forms and oceanic solitude.',
    status: 'AVAILABLE',
    stock: 1,
    featured: true,
    certificateOfAuthenticity: {
      issued: true,
      certificateNumber: 'COA-2026-001',
      issueDate: '2026-01-15'
    }
  },
  {
    id: 'ART-002',
    title: 'Architectural Mirage IV',
    artist: 'Marcus Vance',
    medium: 'Acrylic on Canvas',
    dimensions: '24 x 36 inches (61 x 91 cm)',
    priceCents: 165000,
    priceFormatted: '$1,650.00',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Geometric layering and brutalist light textures reflecting modernist skyline silhouettes.',
    status: 'AVAILABLE',
    stock: 1,
    featured: true,
    certificateOfAuthenticity: {
      issued: true,
      certificateNumber: 'COA-2026-002',
      issueDate: '2026-02-01'
    }
  },
  {
    id: 'ART-003',
    title: 'Ethereal Topographies',
    artist: 'Aria Chen',
    medium: 'Digital Fine Art',
    dimensions: '30 x 40 inches (76 x 102 cm)',
    priceCents: 98000,
    priceFormatted: '$980.00',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80',
    description: 'Algorithmic procedural heightmaps printed on museum-grade rag archival paper.',
    status: 'AVAILABLE',
    stock: 1,
    featured: true,
    certificateOfAuthenticity: {
      issued: true,
      certificateNumber: 'COA-2026-003',
      issueDate: '2026-02-14'
    }
  },
  {
    id: 'ART-004',
    title: 'Terra Sancta II',
    artist: 'Elena Rostova',
    medium: 'Oil on Linen',
    dimensions: '40 x 50 inches (102 x 127 cm)',
    priceCents: 320000,
    priceFormatted: '$3,200.00',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep cadmium red and raw umber pigments depicting ancient sediment formations.',
    status: 'AVAILABLE',
    stock: 1,
    featured: false,
    certificateOfAuthenticity: {
      issued: true,
      certificateNumber: 'COA-2026-004',
      issueDate: '2026-02-20'
    }
  },
  {
    id: 'ART-005',
    title: 'Monolith in Obsidian',
    artist: 'Gabriel Thorne',
    medium: 'Bronze Sculpture',
    dimensions: '18 x 12 x 12 inches (46 x 30 x 30 cm)',
    priceCents: 450000,
    priceFormatted: '$4,500.00',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    description: 'Lost-wax cast bronze with hand-patinated obsidian and satin brass inclusions.',
    status: 'AVAILABLE',
    stock: 1,
    featured: true,
    certificateOfAuthenticity: {
      issued: true,
      certificateNumber: 'COA-2026-005',
      issueDate: '2026-03-01'
    }
  },
  {
    id: 'ART-006',
    title: 'Chromatic Pulse',
    artist: 'Marcus Vance',
    medium: 'Acrylic on Canvas',
    dimensions: '48 x 48 inches (122 x 122 cm)',
    priceCents: 210000,
    priceFormatted: '$2,100.00',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    description: 'Dynamic kinetic sweeps across chromatic gradients evoking urban resonance.',
    status: 'AVAILABLE',
    stock: 1,
    featured: false,
    certificateOfAuthenticity: {
      issued: true,
      certificateNumber: 'COA-2026-006',
      issueDate: '2026-03-10'
    }
  }
];

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`API status: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      service: 'Arts Gallery Web Application API',
      version: '1.0.0',
      environment: 'offline-preview',
      uptimeSeconds: 0,
      timestamp: new Date().toISOString(),
      database: {
        mode: 'CLIENT_OFFLINE_PREVIEW',
        status: 'STANDBY',
        host: 'localhost:5000',
      },
      architecture: {
        topology: 'Decoupled N-Tier Microservices',
        costMonthly: '$0.00',
        framework: 'Next.js 15 Client',
      },
    };
  }
}

// ----------------------------------------------------
// Authentication API
// ----------------------------------------------------
export const authApi = {
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    return data;
  },

  async register(payload: { name: string; email: string; password: string; role?: string; artistStatement?: string }): Promise<{ success: boolean; token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  },

  async getMe(token: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to retrieve profile');
    }
    return data;
  },
};

// ----------------------------------------------------
// Artworks API
// ----------------------------------------------------
export const artworksApi = {
  async getArtworks(params?: {
    medium?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<{ success: boolean; data: Artwork[]; count: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.medium && params.medium !== 'All') query.append('medium', params.medium);
      if (params?.status) query.append('status', params.status);
      if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
      if (params?.search) query.append('search', params.search);

      const url = `${API_BASE_URL}/artworks${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to fetch artworks (${res.status})`);
      }
      return await res.json();
    } catch (err) {
      // Return fallback dataset filtered locally if backend is unavailable
      let filtered = [...FALLBACK_ARTWORKS];
      if (params?.medium && params.medium !== 'All') {
        filtered = filtered.filter(a => a.medium.toLowerCase().includes(params.medium!.toLowerCase()));
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q));
      }
      return { success: true, data: filtered, count: filtered.length };
    }
  },

  async getArtworkById(id: string): Promise<{ success: boolean; data: Artwork }> {
    try {
      const res = await fetch(`${API_BASE_URL}/artworks/${id}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Artwork not found (${res.status})`);
      }
      return await res.json();
    } catch (err) {
      const found = FALLBACK_ARTWORKS.find(a => a.id === id) || FALLBACK_ARTWORKS[0];
      return { success: true, data: found };
    }
  },

  async createArtwork(
    payload: {
      title: string;
      medium: string;
      dimensions: string;
      priceCents: number;
      image: string;
      description: string;
      stock?: number;
    },
    token: string
  ): Promise<{ success: boolean; data: Artwork; message: string }> {
    const res = await fetch(`${API_BASE_URL}/artworks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit artwork');
    }
    return data;
  },
};

// ----------------------------------------------------
// Curation API (Admin & Curatorial Board)
// ----------------------------------------------------
export const curationApi = {
  async getPendingArtworks(token: string): Promise<{ success: boolean; data: Artwork[]; count: number }> {
    const res = await fetch(`${API_BASE_URL}/curation/pending`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch pending artworks');
    }
    return data;
  },

  async approveArtwork(id: string, token: string): Promise<{ success: boolean; data: Artwork; message: string }> {
    const res = await fetch(`${API_BASE_URL}/curation/approve/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to approve artwork');
    }
    return data;
  },

  async rejectArtwork(id: string, rejectionReason: string, token: string): Promise<{ success: boolean; data: Artwork; message: string }> {
    const res = await fetch(`${API_BASE_URL}/curation/reject/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rejectionReason }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reject artwork');
    }
    return data;
  },
};

// ----------------------------------------------------
// Orders API (Acquisitions & Fulfillment)
// ----------------------------------------------------
export const ordersApi = {
  async createOrder(
    payload: {
      items: Array<{
        artworkId: string;
        framing?: string;
        framingPriceCents?: number;
      }>;
      shippingAddress: {
        fullName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
      };
      paymentMethod: 'STRIPE_CARD' | 'CASH_ON_DELIVERY';
    },
    token: string
  ): Promise<{ success: boolean; data: Order; message: string }> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Acquisition checkout failed');
    }
    return data;
  },

  async getMyOrders(token: string): Promise<{ success: boolean; data: Order[]; count: number }> {
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch personal orders');
    }
    return data;
  },

  async getAllOrders(token: string): Promise<{ success: boolean; data: Order[]; count: number }> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch gallery orders');
    }
    return data;
  },

  async updateOrderStatus(
    id: string,
    payload: { status: string; trackingNumber?: string },
    token: string
  ): Promise<{ success: boolean; data: Order; message: string }> {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update order status');
    }
    return data;
  },
};

// ----------------------------------------------------
// Reviews API (Collector Ratings & Feedback)
// ----------------------------------------------------
export interface Review {
  id: string;
  customer: string;
  customerName: string;
  artwork: string;
  artworkId: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt?: string;
}

export const reviewsApi = {
  async createReview(
    payload: { artworkId: string; rating: number; comment: string },
    token: string
  ): Promise<{ success: boolean; data: Review; message: string }> {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to submit review');
    }
    return data;
  },

  async getReviewsByArtwork(artworkId: string): Promise<{ success: boolean; data: Review[]; count: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/artwork/${artworkId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    } catch (e) {
      return { success: true, data: [], count: 0 };
    }
  },

  async getAllReviews(): Promise<{ success: boolean; data: Review[]; count: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    } catch (e) {
      return { success: true, data: [], count: 0 };
    }
  },
};

