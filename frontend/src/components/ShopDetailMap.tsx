'use client';

import { useEffect, useRef, useState } from 'react';
import { Shop } from '@/types/shop';
import { Navigation, MapPin } from 'lucide-react';

interface ShopDetailMapProps {
  shop: Shop;
  className?: string;
}

export default function ShopDetailMap({ shop, className = 'w-full h-80' }: ShopDetailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (typeof window === 'undefined' || !containerRef.current) return;
      if (!shop.latitude || !shop.longitude) return;

      const L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        center: [shop.latitude, shop.longitude],
        zoom: 16,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'detail-map-pin',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: #111827;
            border: 3px solid #ffffff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 8px 16px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="transform: rotate(45deg); font-size: 15px;">📍</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon: customIcon }).addTo(map);
      marker
        .bindPopup(
          `<strong>${shop.name}</strong><br><span style="font-size:11px;color:#6b7280">${shop.address}</span>`
        )
        .openPopup();

      mapRef.current = map;
      setLoaded(true);
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [shop]);

  if (!shop.latitude || !shop.longitude) {
    return (
      <div className={`${className} bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center`}>
        <MapPin className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm font-semibold text-gray-700">Coordinates not pinpointed</p>
        <p className="text-xs text-gray-400 mt-1">{shop.address}</p>
        <a
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5" /> Search on Google Maps
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-gray-100">
      <div ref={containerRef} className={className} />
      <div className="absolute top-3 right-3 z-[400]">
        <a
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/95 hover:bg-white text-gray-900 px-3.5 py-2 rounded-xl shadow-md border border-gray-200 text-xs font-bold backdrop-blur-sm flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  );
}

