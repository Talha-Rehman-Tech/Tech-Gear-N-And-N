'use client';

import { useEffect, useRef, useState } from 'react';
import { Shop } from '@/types/shop';
import { Phone, MessageCircle, Navigation, ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ShopMapProps {
  shops: Shop[];
  selectedShop: Shop | null;
  onSelectShop: (shop: Shop | null) => void;
  className?: string;
  userCoords?: { lat: number; lng: number } | null;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  store: { bg: '#2563eb', border: '#1d4ed8', text: '#ffffff' },
  accessories: { bg: '#059669', border: '#047857', text: '#ffffff' },
  repair: { bg: '#d97706', border: '#b45309', text: '#ffffff' },
  computers: { bg: '#7c3aed', border: '#6d28d9', text: '#ffffff' },
  wholesale: { bg: '#dc2626', border: '#b91c1c', text: '#ffffff' },
  electronics: { bg: '#0891b2', border: '#0e7490', text: '#ffffff' },
};

export default function ShopMap({
  shops,
  selectedShop,
  onSelectShop,
  className = 'w-full h-full min-h-[480px]',
  userCoords,
}: ShopMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = await import('leaflet');

      if (isCancelled || !mapContainerRef.current) return;

      // Center around Faisalabad Region
      const initialLat = 31.418;
      const initialLng = 73.079;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        scrollWheelZoom: true,
        zoomControl: false,
      });

      // Add Zoom Control to Top-Right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Clean OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsLoaded(true);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !userCoords) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; width: 22px; height: 22px;">
            <div style="position: absolute; inset: -6px; background: rgba(59, 130, 246, 0.35); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 0; background: #2563eb; border: 3px solid #ffffff; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>📍 Your Current Location</strong>');
    });
  }, [isLoaded, userCoords]);

  // Update Markers when shops change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear existing shop markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      const validShops = shops.filter(s => s.latitude && s.longitude);
      if (validShops.length === 0) return;

      const bounds = L.latLngBounds([]);

      validShops.forEach((shop) => {
        const lat = shop.latitude!;
        const lng = shop.longitude!;
        bounds.extend([lat, lng]);

        const colors = CATEGORY_COLORS[shop.categoryGroup] || CATEGORY_COLORS.store;
        const isSelected = selectedShop?.id === shop.id;

        const pinHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            background: ${colors.bg};
            border: 2px solid #ffffff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: ${isSelected ? '14px' : '11px'};
              font-weight: 800;
              color: #ffffff;
            ">📍</span>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-shop-pin',
          html: pinHtml,
          iconSize: [isSelected ? 38 : 30, isSelected ? 38 : 30],
          iconAnchor: [isSelected ? 19 : 15, isSelected ? 38 : 30],
          popupAnchor: [0, isSelected ? -36 : -28],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Build Popup Content
        const popupDiv = document.createElement('div');
        popupDiv.className = 'shop-popup-content p-1 max-w-[280px] font-sans';
        popupDiv.innerHTML = `
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${colors.bg}15; color: ${colors.bg}; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
              ${shop.area}
            </span>
            ${shop.verified ? '<span style="background: #10b98115; color: #059669; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 700;">✓ Verified</span>' : ''}
          </div>
          <h4 style="font-size: 15px; font-weight: 800; color: #111827; margin: 0 0 4px 0; line-height: 1.25;">
            ${shop.name}
          </h4>
          <p style="font-size: 11px; color: #4b5563; margin: 0 0 6px 0; line-height: 1.35;">
            ${shop.address}
          </p>
          <div style="font-size: 11px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
            📞 ${shop.phoneDisplay}
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; border-top: 1px solid #f3f4f6; padding-top: 8px;">
            <a href="tel:${shop.phone}" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: #111827; color: #ffffff; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Call
            </a>
            ${shop.whatsapp ? `
              <a href="https://wa.me/${shop.whatsapp}?text=Salam,%20I%20found%20your%20shop%20on%20TechGear" target="_blank" rel="noopener noreferrer" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: #25d366; color: #ffffff; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;">
                WhatsApp
              </a>
            ` : ''}
            <a href="${shop.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; background: #f3f4f6; color: #111827; padding: 6px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none;" title="Open in Google Maps">
              🗺️ Map
            </a>
          </div>
          <div style="margin-top: 6px; text-align: center;">
            <a href="/shops/${shop.id}" style="display: block; font-size: 11px; font-weight: 700; color: #2563eb; text-decoration: none; padding-top: 4px;">
              View Full Details &rarr;
            </a>
          </div>
        `;

        marker.bindPopup(popupDiv);

        marker.on('click', () => {
          onSelectShop(shop);
        });

        markersRef.current.set(shop.id, marker);
      });

      // Fit map to visible shops if not manually selected
      if (!selectedShop && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    });
  }, [isLoaded, shops, onSelectShop, selectedShop]);

  // Center/Fly to selected shop
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !selectedShop) return;

    const map = mapInstanceRef.current;
    if (selectedShop.latitude && selectedShop.longitude) {
      map.flyTo([selectedShop.latitude, selectedShop.longitude], 16, {
        duration: 1.2,
      });

      const marker = markersRef.current.get(selectedShop.id);
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    }
  }, [isLoaded, selectedShop]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-gray-200/80 shadow-inner bg-gray-100">
      <div ref={mapContainerRef} className={className} />

      {/* Recenter & Controls Floating Overlay */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={() => {
            if (!mapInstanceRef.current) return;
            const valid = shops.filter(s => s.latitude && s.longitude);
            if (valid.length > 0) {
              import('leaflet').then(L => {
                const b = L.latLngBounds(valid.map(s => [s.latitude!, s.longitude!]));
                mapInstanceRef.current.fitBounds(b, { padding: [40, 40] });
              });
            }
          }}
          className="bg-white/95 hover:bg-white text-gray-800 p-2.5 rounded-xl shadow-lg border border-gray-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          title="Fit All Shops In View"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Fit All</span>
        </button>
      </div>

      {/* Selected Shop Preview Pill at Bottom-Left */}
      {selectedShop && (
        <div className="absolute top-4 left-4 right-14 sm:right-auto z-[400] max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-200/90 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {selectedShop.area}
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {selectedShop.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">
                {selectedShop.name}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                {selectedShop.address}
              </p>
            </div>
            <button
              onClick={() => onSelectShop(null)}
              className="text-gray-400 hover:text-gray-700 text-sm font-bold px-1.5"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
            <a
              href={`tel:${selectedShop.phone}`}
              className="flex-1 py-1.5 px-3 bg-black text-white text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
            >
              <Phone className="w-3 h-3" /> Call
            </a>
            {selectedShop.whatsapp && (
              <a
                href={`https://wa.me/${selectedShop.whatsapp}?text=Salam,%20I%20found%20your%20shop%20on%20TechGear`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 bg-[#25d366] text-white text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            )}
            <Link
              href={`/shops/${selectedShop.id}`}
              className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              Details <ExternalLink className="w-3 h-3 text-gray-500" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

