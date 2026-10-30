import { ArrowRight, Zap, Shield, Truck, Headset, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { GsapFadeIn, GsapStaggerGrid, GsapHeroSection } from '@/components/GsapAnimations';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/products';
import { API_BASE_URL } from '@/lib/api';

const categories = [
  { name: 'Fast Chargers', image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop', link: '/category/fast-chargers', badge: 'Up to 100W GaN', count: '12+ Items' },
  { name: 'Wireless Earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', link: '/category/earbuds', badge: 'Active ANC & Hi-Fi', count: '16+ Items' },
  { name: 'Over-Ear Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', link: '/category/headphones', badge: 'Studio Acoustics', count: '10+ Items' },
  { name: 'Keyboards', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', link: '/category/keyboards', badge: 'Mechanical RGB', count: '14+ Items' },
  { name: 'Gaming & Office Mice', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop', link: '/category/mice', badge: 'Wireless & 16K DPI', count: '12+ Items' },
  { name: 'Wireless Devices & Docks', image: 'https://images.unsplash.com/photo-1622445262464-84b14e572007?q=80&w=600&auto=format&fit=crop', link: '/category/wireless-devices', badge: '3-in-1 MagSafe 15W', count: '9+ Items' },
  { name: 'USB & Flash Drives', image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=600&auto=format&fit=crop', link: '/category/usb-drives', badge: 'Dual OTG 400MB/s', count: '15+ Items' },
  { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1610945400287-34758564e9a3?q=80&w=600&auto=format&fit=crop', link: '/category/power-banks', badge: '65W Laptop PD', count: '11+ Items' },
];

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products?isFeatured=true`, { 
      cache: 'no-store' 
    });
    if (!res.ok) {
      return DEFAULT_PRODUCTS.filter(p => p.isFeatured);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return DEFAULT_PRODUCTS.filter(p => p.isFeatured);
  } catch {
    return DEFAULT_PRODUCTS.filter(p => p.isFeatured);
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="w-full bg-[#fbfbfb] overflow-hidden">
      
      {/* Hero Section with GSAP Animations */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:py-16">
        <div className="bg-gray-950 rounded-3xl sm:rounded-[2.5rem] overflow-hidden relative min-h-[460px] md:min-h-[540px] flex items-center shadow-2xl border border-gray-800/80">
          
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1628102491629-77858ab5721d?q=80&w=1600&auto=format&fit=crop" 
              alt="Premium Mobile Accessories" 
              className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <GsapHeroSection
            title="Power up your everyday carry."
            subtitle="Discover cutting-edge GaN fast chargers, studio-grade wireless audio, and indestructible braided cables with official warranty."
            badge="Engineered For Speed & Durability"
          />

          {/* Action Buttons */}
          <div className="absolute bottom-8 left-6 sm:left-12 md:left-16 z-20 flex flex-wrap gap-4 gsap-hero-buttons">
            <Link 
              href="/category/all" 
              className="bg-white text-black px-7 py-3.5 rounded-full font-extrabold hover:bg-gray-100 hover:scale-105 transition-all flex items-center gap-2 group shadow-xl"
            >
              Shop All Gear
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/category/fast-chargers" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full font-semibold transition-all backdrop-blur-md hover:scale-105"
            >
              Explore Fast Chargers
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <GsapFadeIn direction="up">
        <section className="border-y border-gray-200/60 bg-white shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Express Delivery</h4>
                  <p className="text-xs text-gray-500">2-4 working days across Pakistan</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-xs">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Official Warranty</h4>
                  <p className="text-xs text-gray-500">Instant replacement guarantee</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-xs">
                  <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">100% Authentic</h4>
                  <p className="text-xs text-gray-500">GaN III & MFi certified gear</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-xs">
                  <Headset className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">24/7 Support</h4>
                  <p className="text-xs text-gray-500">Instant WhatsApp assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GsapFadeIn>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GsapFadeIn direction="up">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Curated Collections</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Shop by Category</h2>
            </div>
            <Link href="/category/all" className="text-sm font-bold text-black hover:underline flex items-center gap-1 group">
              Browse Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </GsapFadeIn>
        
        <GsapStaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.link}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 block"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full w-max mb-2 border border-white/10">
                  {category.badge}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight group-hover:translate-x-1 transition-transform">
                  {category.name}
                </h3>
                <span className="text-xs text-gray-300 mt-1 font-medium">{category.count}</span>
              </div>
            </Link>
          ))}
        </GsapStaggerGrid>
      </section>

      {/* Featured Products */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GsapFadeIn direction="up">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Handpicked Gear</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Trending Accessories</h2>
            </div>
            <Link href="/category/all" className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </GsapFadeIn>
        
        <GsapStaggerGrid className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product: ProductItem) => {
            const isDiscounted = product.discountPrice && product.discountPrice > product.price;
            return (
              <div 
                key={product._id} 
                className="group bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/product/${product._id}`} className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-pointer block mb-3 border border-gray-100">
                    {product.isFeatured && (
                      <span className="absolute top-2.5 left-2.5 bg-black/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                        Featured
                      </span>
                    )}
                    {isDiscounted && (
                      <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                        Sale
                      </span>
                    )}
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/600'} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                  </Link>

                  <div className="px-1">
                    {product.brand && (
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {product.brand}
                      </span>
                    )}
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:underline">
                        {product.name}
                      </h3>
                    </Link>

                    {product.ratings !== undefined && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-gray-800">{product.ratings}</span>
                        <span className="text-gray-400">({product.numOfReviews || 24})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between px-1">
                  <div>
                    <span className="text-base sm:text-lg font-black text-gray-900">Rs. {product.price}</span>
                    {isDiscounted && (
                      <div className="text-xs text-gray-400 line-through">Rs. {product.discountPrice}</div>
                    )}
                  </div>
                  <Link 
                    href={`/product/${product._id}`}
                    className="p-2.5 bg-black text-white rounded-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-md"
                    title="Quick View & Buy"
                  >
                    <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </GsapStaggerGrid>
      </section>

      {/* Shop Directory Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-gray-800">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-4">
              📍 Local Mobile Market Network
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Looking for a nearby mobile store or repair specialist?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-3 leading-relaxed">
              Find <strong className="text-white">580+ verified mobile phone shops, repair centers & wholesale dealers</strong> plotted with live GPS coordinates, direct phone numbers, and WhatsApp links across 16 major bazaars.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {['D Ground (100)', 'Kutchery Bazar (57)', 'Chiniot (53)', 'Gojra (54)', 'Chak Jhumra (48)', 'Samundri (47)', 'Rex City (32)', 'Khurrianwala (38)'].map((areaName) => (
                <span
                  key={areaName}
                  className="px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold text-gray-200 border border-white/10"
                >
                  {areaName}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shops"
                className="px-8 py-4 bg-white text-black font-extrabold text-sm rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-xl flex items-center gap-2 group"
              >
                Explore Shop Directory on Map
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shops?category=repair"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-full transition-all backdrop-blur-md"
              >
                Find Repair Labs
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
