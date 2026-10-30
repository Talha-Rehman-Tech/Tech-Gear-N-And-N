export interface Shop {
  id: string;
  name: string;
  area: string;
  category: string;
  categoryGroup: 'store' | 'repair' | 'accessories' | 'computers' | 'wholesale' | 'electronics';
  phone: string;
  phoneDisplay: string;
  phones: string[];
  whatsapp?: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  hasExactCoordinates: boolean;
  hasCoordinates: boolean;
  googleMapsUrl: string;
  features: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  distanceKm?: number; // Calculated dynamically if user enables geolocation
}

export type CategoryFilter = 'all' | 'store' | 'accessories' | 'repair' | 'computers' | 'wholesale' | 'electronics';

export interface ShopFilterState {
  search: string;
  area: string;
  category: CategoryFilter;
  hasWhatsAppOnly: boolean;
  verifiedOnly: boolean;
  sortBy: 'name' | 'area' | 'rating' | 'nearest';
}

