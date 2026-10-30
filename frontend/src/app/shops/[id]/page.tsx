import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ShopDetailMap from '@/components/ShopDetailMap';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Share2, 
  Store, 
  Star,
  ExternalLink,
  Copy,
  Layers,
  Wrench,
  Headphones,
  Check
} from 'lucide-react';
import shopsDataRaw from '@/data/shops.json';
import { Shop } from '@/types/shop';

const shops: Shop[] = shopsDataRaw as Shop[];

export async function generateStaticParams() {
  // Pre-render top 30 shops at build time for fast Vercel edge delivery
  return shops.slice(0, 30).map((shop) => ({
    id: shop.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shop = shops.find((s) => s.id === id);

  if (!shop) {
    return {
      title: 'Shop Not Found | TechGear Directory',
    };
  }

  return {
    title: `${shop.name} - Mobile Shop in ${shop.area} | TechGear`,
    description: `${shop.name} located at ${shop.address}, ${shop.area}. Phone: ${shop.phone}. Browse mobile accessories, chargers, and repairs on TechGear.`,
    openGraph: {
      title: `${shop.name} - ${shop.area}`,
      description: `Visit ${shop.name} for mobile accessories, chargers, and repair services in ${shop.area}.`,
    },
  };
}

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = shops.find((s) => s.id === id);

  if (!shop) {
    notFound();
  }

  // Get other shops in the same area
  const relatedShops = shops
    .filter((s) => s.area === shop.area && s.id !== shop.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 overflow-x-auto hide-scrollbar">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/shops" className="hover:text-black">
              Shop Directory
            </Link>
            <span>/</span>
            <Link href={`/shops?area=${encodeURIComponent(shop.area)}`} className="hover:text-black">
              {shop.area}
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{shop.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Back Link */}
        <Link
          href="/shops"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info Column (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Main Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-blue-50 text-blue-700 tracking-wider">
                  {shop.area}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                  {shop.category}
                </span>
                {shop.verified && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Business
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {shop.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-gray-900 ml-1.5">{shop.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-medium">{shop.reviewCount} Community Reviews</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600 font-bold">Open Today</span>
              </div>

              {/* Address */}
              <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Shop Address
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-relaxed">
                    {shop.address}
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <a
                  href={`tel:${shop.phone}`}
                  className="py-3.5 px-6 bg-black hover:bg-gray-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Phone className="w-4 h-4" /> Call Now ({shop.phone})
                </a>

                {shop.whatsapp ? (
                  <a
                    href={`https://wa.me/${shop.whatsapp}?text=Salam,%20I%20found%20${encodeURIComponent(shop.name)}%20on%20TechGear%20Mobile%20Directory`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </a>
                ) : (
                  <a
                    href={shop.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                  >
                    <Navigation className="w-4 h-4" /> Get Directions
                  </a>
                )}
              </div>

              {/* Extra Phone Numbers if any */}
              {shop.phones && shop.phones.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-500 block mb-2">
                    Additional Contact Numbers:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {shop.phones.map((p, idx) => (
                      <a
                        key={idx}
                        href={`tel:${p}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-gray-500" /> {p}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services & Offerings */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" /> Products & Services Offered
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shop.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>In-Person Testing & Inspection</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery / Walk-in</span>
                </div>
              </div>
            </div>

            {/* Business Hours & Shopping Guidelines */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-700" /> Market Timings & Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Operating Hours
                  </span>
                  <div className="mt-1 font-semibold text-gray-800">
                    Monday – Sunday
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    10:00 AM – 10:00 PM (PST)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Friday Prayer Break
                  </span>
                  <div className="mt-1 font-semibold text-gray-800">
                    1:00 PM – 2:30 PM
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Resumes after Jummah prayer
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  <strong>Buyer Tip:</strong> Call or message the shop on WhatsApp prior to visiting to confirm item stock, warranty verification, and best prices.
                </p>
              </div>
            </div>

          </div>

          {/* Map & Coordinates Column (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Exact Map Location
                </h3>

                {shop.latitude && shop.longitude && (
                  <span className="text-[11px] font-mono font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    {shop.latitude.toFixed(5)}, {shop.longitude.toFixed(5)}
                  </span>
                )}
              </div>

              {/* Map View */}
              <ShopDetailMap shop={shop} className="w-full h-80" />

              {/* Coordinates Info & Google Maps Directions Link */}
              <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Coordinates: <span className="font-semibold text-gray-800">{shop.latitude ? `${shop.latitude}, ${shop.longitude}` : 'Approximate'}</span>
                </div>

                <a
                  href={shop.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Related Nearby Shops in Same Area */}
            {relatedShops.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    More Shops in {shop.area}
                  </h3>
                  <Link
                    href={`/shops?area=${encodeURIComponent(shop.area)}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  {relatedShops.map((rShop) => (
                    <Link
                      key={rShop.id}
                      href={`/shops/${rShop.id}`}
                      className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {rShop.name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {rShop.address}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-400 group-hover:text-black shrink-0 ml-2">
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
