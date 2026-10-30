'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Store, 
  Wrench, 
  Headphones, 
  Laptop, 
  CheckCircle2, 
  Compass, 
  Grid3X3, 
  Map as MapIcon, 
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import shopsDataRaw from '@/data/shops.json';
import { Shop, CategoryFilter } from '@/types/shop';

// Dynamic import of Leaflet map to guarantee SSR compatibility on Vercel
const ShopMap = dynamic(() => import('@/components/ShopMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 animate-pulse">
      <MapPin className="w-10 h-10 mb-3 text-gray-300" />
      <span className="text-sm font-semibold">Loading Interactive Map...</span>
      <span className="text-xs text-gray-400 mt-1">Plotting 580+ Shop Coordinates</span>
    </div>
  ),
});

const allShops = shopsDataRaw as Shop[];

const CATEGORY_TABS: { id: CategoryFilter; label: string; icon: typeof Store }[] = [
  { id: 'all', label: 'All Shops', icon: Store },
  { id: 'store', label: 'Retail Stores', icon: Store },
  { id: 'accessories', label: 'Accessories & Parts', icon: Headphones },
  { id: 'repair', label: 'Repair & Labs', icon: Wrench },
  { id: 'computers', label: 'Computers & IT', icon: Laptop },
  { id: 'wholesale', label: 'Wholesale & Dealers', icon: Building2 },
];

export default function ShopDirectoryPage() {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [hasWhatsAppOnly, setHasWhatsAppOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // User Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Calculate distance between two coordinates in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Request browser geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.message || 'Unable to retrieve location');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Areas list with counts
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allShops.forEach((s) => {
      counts[s.area] = (counts[s.area] || 0) + 1;
    });
    return counts;
  }, []);

  const sortedAreas = useMemo(() => {
    return Object.keys(areaCounts).sort((a, b) => areaCounts[b] - areaCounts[a]);
  }, [areaCounts]);

  // Filtered Shops
  const filteredShops = useMemo(() => {
    let list = allShops;

    if (selectedArea !== 'all') {
      list = list.filter((s) => s.area.toLowerCase() === selectedArea.toLowerCase());
    }

    if (selectedCategory !== 'all') {
      list = list.filter((s) => s.categoryGroup === selectedCategory);
    }

    if (hasWhatsAppOnly) {
      list = list.filter((s) => Boolean(s.whatsapp));
    }

    if (verifiedOnly) {
      list = list.filter((s) => s.verified);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.phone.includes(q)
      );
    }

    // Compute distance if user location is available
    if (userCoords) {
      list = list.map((s) => ({
        ...s,
        distanceKm:
          s.latitude && s.longitude
            ? getDistance(userCoords.lat, userCoords.lng, s.latitude, s.longitude)
            : undefined,
      }));

      list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    return list;
  }, [selectedArea, selectedCategory, hasWhatsAppOnly, verifiedOnly, search, userCoords]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [search, selectedArea, selectedCategory, hasWhatsAppOnly, verifiedOnly]);

  const paginatedShops = useMemo(() => {
    return filteredShops.slice(0, page * pageSize);
  }, [filteredShops, page]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Verified Punjab Mobile Market Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Shop Directory & Store Locator
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
                Explore <span className="text-white font-bold">580+ phone shops</span>, wholesale dealers, 
                and repair labs with exact map coordinates, WhatsApp contact, and live directions across Faisalabad, Chiniot, Gojra, Samundri & surrounding areas.
              </p>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm self-start md:self-auto">
              <div className="text-center px-2">
                <div className="text-2xl font-black text-white">581</div>
                <div className="text-[11px] font-medium text-gray-400">Total Shops</div>
              </div>
              <div className="text-center px-2 border-x border-white/10">
                <div className="text-2xl font-black text-blue-400">16</div>
                <div className="text-[11px] font-medium text-gray-400">Bazaars/Areas</div>
              </div>
              <div className="text-center px-2">
                <div className="text-2xl font-black text-emerald-400">550+</div>
                <div className="text-[11px] font-medium text-gray-400">WhatsApp</div>
              </div>
            </div>
          </div>

          {/* Search Bar & GPS Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by shop name, bazaar, address, or phone number..."
                className="w-full pl-11 pr-4 py-3.5 bg-white text-gray-900 rounded-2xl text-sm font-medium shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-3.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={handleRequestLocation}
              disabled={geoLoading}
              className={`px-5 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0 ${
                userCoords
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-900'
              }`}
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
              <span>{geoLoading ? 'Detecting...' : userCoords ? 'GPS Active (Nearest First)' : 'Find Near Me'}</span>
            </button>
          </div>

          {geoError && (
            <p className="mt-2 text-xs text-rose-400 font-medium">
              ⚠️ {geoError}
            </p>
          )}
        </div>
      </section>

      {/* Sticky Filters & View Switcher */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Area Filters & Toggles */}
          <div className="flex items-center justify-between gap-4 mt-2.5 pt-2.5 border-t border-gray-100">
            {/* Area Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar flex-1 py-0.5">
              <button
                onClick={() => setSelectedArea('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  selectedArea === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Areas ({allShops.length})
              </button>
              {sortedAreas.map((area) => {
                const count = areaCounts[area];
                const isSelected = selectedArea.toLowerCase() === area.toLowerCase();
                return (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {area} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Mode Switcher (Desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'split' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'
                }`}
                title="Split Map & List View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Split
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'
                }`}
                title="Grid Cards View"
              >
                <Grid3X3 className="w-3.5 h-3.5" /> Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'map' ? 'bg-white shadow-xs text-black' : 'text-gray-500 hover:text-black'
                }`}
                title="Full Map View"
              >
                <MapIcon className="w-3.5 h-3.5" /> Full Map
              </button>
            </div>
          </div>

          {/* Secondary Quick Toggles */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                <input
                  type="checkbox"
                  checked={hasWhatsAppOnly}
                  onChange={(e) => setHasWhatsAppOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="font-medium">WhatsApp Available</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-black">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="font-medium">Verified Stores Only</span>
              </label>
            </div>

            <div className="font-semibold text-gray-700">
              Showing <span className="text-black font-extrabold">{filteredShops.length}</span> shops
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Full Map View */}
        {viewMode === 'map' && (
          <div className="h-[75vh] w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <ShopMap
              shops={filteredShops}
              selectedShop={selectedShop}
              onSelectShop={setSelectedShop}
              userCoords={userCoords}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Grid Cards View */}
        {viewMode === 'grid' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  isSelected={selectedShop?.id === shop.id}
                  onSelect={() => setSelectedShop(shop)}
                />
              ))}
            </div>

            {paginatedShops.length < filteredShops.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95"
                >
                  Load More Shops ({filteredShops.length - paginatedShops.length} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Split View (Default): List on Left, Map on Right */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Shop Cards List (Left Column) */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-3.5 order-2 lg:order-1">
              {paginatedShops.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                  <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900">No shops found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search query, selecting &ldquo;All Areas&rdquo;, or resetting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedArea('all');
                      setSelectedCategory('all');
                      setHasWhatsAppOnly(false);
                      setVerifiedOnly(false);
                    }}
                    className="mt-4 px-5 py-2 bg-black text-white text-xs font-semibold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    {paginatedShops.map((shop) => (
                      <ShopCard
                        key={shop.id}
                        shop={shop}
                        isSelected={selectedShop?.id === shop.id}
                        onSelect={() => setSelectedShop(shop)}
                      />
                    ))}
                  </div>

                  {paginatedShops.length < filteredShops.length && (
                    <div className="text-center py-4">
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        className="w-full py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-xs font-bold transition-all shadow-xs"
                      >
                        Load More ({filteredShops.length - paginatedShops.length} more)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Interactive Sticky Map (Right Column) */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 lg:sticky lg:top-44">
              <div className="h-[400px] lg:h-[calc(100vh-220px)] w-full rounded-3xl overflow-hidden shadow-md border border-gray-200">
                <ShopMap
                  shops={filteredShops}
                  selectedShop={selectedShop}
                  onSelectShop={setSelectedShop}
                  userCoords={userCoords}
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponent: Shop Card
function ShopCard({
  shop,
  isSelected,
  onSelect,
}: {
  shop: Shop;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:shadow-md flex flex-col justify-between ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20'
          : 'border-gray-200/90 hover:border-gray-300'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-gray-100 text-gray-700">
              {shop.area}
            </span>
            <span className="text-[10px] font-bold text-gray-500 truncate max-w-[120px]">
              {shop.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {shop.distanceKm !== undefined && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {shop.distanceKm} km away
              </span>
            )}
            {shop.verified && (
              <span title="Verified Store">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </span>
            )}
          </div>
        </div>

        {/* Shop Name */}
        <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
          <Link href={`/shops/${shop.id}`} className="hover:underline">
            {shop.name}
          </Link>
        </h3>

        {/* Address */}
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <span>{shop.address}</span>
        </p>

        {/* Phone */}
        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-gray-800">
          <Phone className="w-3.5 h-3.5 text-gray-500" />
          <span>{shop.phoneDisplay}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${shop.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-gray-100 hover:bg-black hover:text-white text-gray-800 rounded-xl text-xs font-semibold transition-colors"
            title="Call Shop"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>

          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp}?text=Salam,%20I%20saw%20your%20shop%20on%20TechGear`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-emerald-50 hover:bg-[#25d366] text-emerald-700 hover:text-white rounded-xl text-xs font-semibold transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}

          <a
            href={shop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            title="Open Google Maps Directions"
          >
            <Navigation className="w-3.5 h-3.5" />
          </a>
        </div>

        <Link
          href={`/shops/${shop.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-bold text-gray-800 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
