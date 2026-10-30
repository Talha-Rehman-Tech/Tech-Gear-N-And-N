'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Filter, 
  ChevronDown, 
  Zap, 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { DEFAULT_PRODUCTS, ProductItem } from '@/data/products';
import { GsapStaggerGrid } from '@/components/GsapAnimations';
import { API_BASE_URL } from '@/lib/api';

type Product = ProductItem;

const getLocalFilteredProducts = (
  slug: string,
  brand: string,
  maxPrice: number,
  inStockOnly: boolean,
  sortBy: string
): Product[] => {
  const normSlug = slug === 'chargers' ? 'fast-chargers' : slug === 'powerbanks' ? 'power-banks' : slug;
  let items = [...DEFAULT_PRODUCTS];

  if (normSlug && normSlug !== 'all' && normSlug !== 'new') {
    items = items.filter(p => {
      const pSlug = typeof p.category === 'object' ? p.category.slug : p.category;
      return pSlug === normSlug || normSlug.includes(pSlug) || pSlug.includes(normSlug);
    });
  }

  if (brand !== 'All') {
    items = items.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (maxPrice < 10000) {
    items = items.filter(p => p.price <= maxPrice);
  }

  if (inStockOnly) {
    items = items.filter(p => p.stock > 0);
  }

  if (sortBy === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    items.sort((a, b) => b.ratings - a.ratings);
  }

  return items as Product[];
};

const CATEGORY_MAP: Record<string, { title: string; desc: string; banner: string }> = {
  all: {
    title: 'All Accessories',
    desc: 'Explore our complete catalog of high-performance chargers, keyboards, mice, headphones, earbuds, USB storage, and wireless gear.',
    banner: 'https://images.unsplash.com/photo-1628102491629-77858ab5721d?q=80&w=1600&auto=format&fit=crop'
  },
  'fast-chargers': {
    title: 'Fast Chargers',
    desc: 'Power up at maximum velocity with our GaN III dual & quad port high-wattage wall adapters.',
    banner: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=1600&auto=format&fit=crop'
  },
  chargers: {
    title: 'Fast Chargers',
    desc: 'Power up at maximum velocity with our GaN III dual & quad port high-wattage wall adapters.',
    banner: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=1600&auto=format&fit=crop'
  },
  earbuds: {
    title: 'Wireless Earbuds & Buds',
    desc: 'Experience pure freedom with active noise cancellation, low-latency gaming modes, and all-day battery life.',
    banner: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1600&auto=format&fit=crop'
  },
  buds: {
    title: 'Wireless Earbuds & Buds',
    desc: 'Experience pure freedom with active noise cancellation, low-latency gaming modes, and all-day battery life.',
    banner: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1600&auto=format&fit=crop'
  },
  headphones: {
    title: 'Over-Ear Headphones',
    desc: 'Studio-quality acoustics, plush memory foam earcups, and immersive 7.1 spatial surround sound.',
    banner: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop'
  },
  headphone: {
    title: 'Over-Ear Headphones',
    desc: 'Studio-quality acoustics, plush memory foam earcups, and immersive 7.1 spatial surround sound.',
    banner: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop'
  },
  keyboards: {
    title: 'Keyboards',
    desc: 'Hot-swappable mechanical switches, custom RGB illumination, and ultra-slim wireless Bluetooth keyboards.',
    banner: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1600&auto=format&fit=crop'
  },
  keyboard: {
    title: 'Keyboards',
    desc: 'Hot-swappable mechanical switches, custom RGB illumination, and ultra-slim wireless Bluetooth keyboards.',
    banner: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1600&auto=format&fit=crop'
  },
  mice: {
    title: 'Gaming & Office Mice',
    desc: 'Ultra-lightweight honeycomb gaming mice and silent ergonomic wireless multi-device office mice.',
    banner: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1600&auto=format&fit=crop'
  },
  mouse: {
    title: 'Gaming & Office Mice',
    desc: 'Ultra-lightweight honeycomb gaming mice and silent ergonomic wireless multi-device office mice.',
    banner: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1600&auto=format&fit=crop'
  },
  'wireless-devices': {
    title: 'Wireless Devices & Docks',
    desc: '3-in-1 magnetic MagSafe charging stands and ultra-slim Qi certified fast wireless inductive pads.',
    banner: 'https://images.unsplash.com/photo-1622445262464-84b14e572007?q=80&w=1600&auto=format&fit=crop'
  },
  wireless: {
    title: 'Wireless Devices & Docks',
    desc: '3-in-1 magnetic MagSafe charging stands and ultra-slim Qi certified fast wireless inductive pads.',
    banner: 'https://images.unsplash.com/photo-1622445262464-84b14e572007?q=80&w=1600&auto=format&fit=crop'
  },
  'usb-drives': {
    title: 'USB & Flash Drives',
    desc: 'Ultra-fast dual USB-C & USB-A OTG mobile flash drives and rugged waterproof metal thumb drives.',
    banner: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1600&auto=format&fit=crop'
  },
  usb: {
    title: 'USB & Flash Drives',
    desc: 'Ultra-fast dual USB-C & USB-A OTG mobile flash drives and rugged waterproof metal thumb drives.',
    banner: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1600&auto=format&fit=crop'
  },
  audio: {
    title: 'Audio & TWS',
    desc: 'Immerse in pure acoustics with active noise cancellation, deep bass, and ultra-low latency.',
    banner: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1600&auto=format&fit=crop'
  },
  cables: {
    title: 'Durable Cables',
    desc: 'Military-grade braided fast-charging and high-speed data transfer cables built to endure.',
    banner: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d06c?q=80&w=1600&auto=format&fit=crop'
  },
  'power-banks': {
    title: 'Power Banks',
    desc: 'Magnetic wireless MagSafe packs and high-capacity 65W laptop portable batteries.',
    banner: 'https://images.unsplash.com/photo-1610945400287-34758564e9a3?q=80&w=1600&auto=format&fit=crop'
  },
  powerbanks: {
    title: 'Power Banks',
    desc: 'Magnetic wireless MagSafe packs and high-capacity 65W laptop portable batteries.',
    banner: 'https://images.unsplash.com/photo-1610945400287-34758564e9a3?q=80&w=1600&auto=format&fit=crop'
  },
  new: {
    title: 'New Arrivals',
    desc: 'The latest next-gen accessories and newly launched high-performance devices.',
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1600&auto=format&fit=crop'
  }
};

const CATEGORIES_LIST = [
  { slug: 'all', name: 'All' },
  { slug: 'fast-chargers', name: 'Fast Chargers' },
  { slug: 'earbuds', name: 'Earbuds & Buds' },
  { slug: 'headphones', name: 'Headphones' },
  { slug: 'keyboards', name: 'Keyboards' },
  { slug: 'mice', name: 'Mice' },
  { slug: 'wireless-devices', name: 'Wireless Devices' },
  { slug: 'usb-drives', name: 'USB & Flash Drives' },
  { slug: 'power-banks', name: 'Power Banks' },
  { slug: 'cables', name: 'Cables' },
];

const BRANDS_LIST = [
  'All', 
  'TechGear', 
  'Anker Tech', 
  'Baseus Tech', 
  'SoundWave', 
  'SoundWave Pro',
  'KeyChron Pro', 
  'LogiTech Gear', 
  'RazerTech', 
  'MagCharge', 
  'SanDisk Tech', 
  'Kingston Pro'
];

export default function CategoryPage() {
  const params = useParams();

  const slugParam = (params?.slug as string) || 'all';
  const rawSlug = slugParam.toLowerCase();
  const currentCategoryInfo = CATEGORY_MAP[rawSlug] || {
    title: rawSlug.replace('-', ' ').toUpperCase(),
    desc: 'Discover our top-tier accessories engineered for speed and reliability.',
    banner: 'https://images.unsplash.com/photo-1628102491629-77858ab5721d?q=80&w=1600&auto=format&fit=crop'
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setLoading(true);
    });

    const backendCategory = rawSlug === 'all' ? '' : (rawSlug === 'chargers' ? 'fast-chargers' : rawSlug === 'powerbanks' ? 'power-banks' : rawSlug);

    const queryParams = new URLSearchParams();
    if (backendCategory) queryParams.set('category', backendCategory);
    if (selectedBrand !== 'All') queryParams.set('brand', selectedBrand);
    if (maxPrice < 10000) queryParams.set('maxPrice', maxPrice.toString());
    if (inStockOnly) queryParams.set('inStock', 'true');
    if (sortBy) queryParams.set('sortBy', sortBy);

    const url = `${API_BASE_URL}/products?${queryParams.toString()}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Backend response not OK');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data as Product[]);
          } else {
            setProducts(getLocalFilteredProducts(rawSlug, selectedBrand, maxPrice, inStockOnly, sortBy));
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(getLocalFilteredProducts(rawSlug, selectedBrand, maxPrice, inStockOnly, sortBy));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rawSlug, selectedBrand, maxPrice, inStockOnly, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/600',
      quantity: 1,
      color: 'Default',
    });

    setAddedNotification(product.name);
    setTimeout(() => {
      setAddedNotification(null);
    }, 2500);
  };

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setMaxPrice(10000);
    setInStockOnly(false);
    setSortBy('recommended');
  };

  const hasActiveFilters = selectedBrand !== 'All' || maxPrice < 10000 || inStockOnly || sortBy !== 'recommended';

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      {/* Toast Notification */}
      {addedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Added <span className="font-bold">{addedNotification}</span> to cart!</span>
          <Link href="/cart" className="text-xs font-bold underline ml-2 text-yellow-300 hover:text-yellow-200">
            View Cart
          </Link>
        </div>
      )}

      {/* Category Header Hero */}
      <div className="relative bg-gray-900 text-white py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={currentCategoryInfo.banner} 
            alt={currentCategoryInfo.title}
            className="w-full h-full object-cover opacity-25 filter blur-sm scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-200 mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Category Showcase
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            {currentCategoryInfo.title}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {currentCategoryInfo.desc}
          </p>
        </div>
      </div>

      {/* Category Pills Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = rawSlug === cat.slug || (rawSlug === 'chargers' && cat.slug === 'fast-chargers') || (rawSlug === 'powerbanks' && cat.slug === 'power-banks');
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-lg sm:text-xl">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 px-4 py-2.5 rounded-xl shadow-xs hover:bg-gray-50 transition-all flex-1 sm:flex-initial justify-center"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasActiveFilters && '•'}
            </button>

            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2.5 pr-9 rounded-xl text-sm font-semibold text-gray-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-black cursor-pointer transition-all"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs sticky top-36 space-y-7">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filter Catalog
                </h3>
                {hasActiveFilters && (
                  <button onClick={handleResetFilters} className="text-xs text-red-600 hover:underline font-semibold">
                    Clear
                  </button>
                )}
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-semibold text-gray-800">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-black rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">Max Price</span>
                  <span className="text-xs font-bold bg-gray-100 text-black px-2.5 py-1 rounded-md">
                    Rs. {maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold text-gray-800 block">Brand</span>
                <div className="flex flex-wrap gap-2">
                  {BRANDS_LIST.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                        selectedBrand === brand
                          ? 'bg-black text-white shadow-xs font-bold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid with GSAP Stagger Reveal */}
          <div className="col-span-1 lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-3 border border-gray-100 animate-pulse flex flex-col gap-3">
                    <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <GsapStaggerGrid className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => {
                  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/600';
                  const isDiscounted = product.discountPrice && product.discountPrice > product.price;

                  return (
                    <div
                      key={product._id}
                      className="group bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <Link href={`/product/${product._id}`} className="block relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 border border-gray-100">
                          {product.isFeatured && (
                            <span className="absolute top-2.5 left-2.5 bg-black/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                              Featured
                            </span>
                          )}
                          {isDiscounted && (
                            <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                              Save Rs. {product.discountPrice! - product.price}
                            </span>
                          )}
                          <img 
                            src={imageUrl} 
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
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-black group-hover:underline transition-colors leading-snug">
                              {product.name}
                            </h3>
                          </Link>

                          {product.ratings !== undefined && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-yellow-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-gray-800">{product.ratings}</span>
                              <span className="text-gray-400">({product.numOfReviews || 12})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 px-1">
                        <div>
                          <div className="text-base sm:text-lg font-black text-gray-900">
                            Rs. {product.price}
                          </div>
                          {isDiscounted && (
                            <div className="text-xs text-gray-400 line-through">
                              Rs. {product.discountPrice}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          title="Add to Cart"
                          className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black hover:scale-110 active:scale-95 transition-all shadow-md flex items-center justify-center"
                        >
                          <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </GsapStaggerGrid>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Match Your Filters</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Try widening your price range or selecting different brand filter options.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" /> Filter Catalog
                </h3>
                <button 
                  onClick={() => setMobileFilterOpen(false)} 
                  className="p-2 text-gray-400 hover:text-black rounded-lg"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-semibold text-gray-800">In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-black rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">Max Price</span>
                  <span className="text-xs font-bold bg-gray-100 text-black px-2.5 py-1 rounded-md">
                    Rs. {maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold text-gray-800 block">Brands</span>
                <div className="flex flex-wrap gap-2">
                  {BRANDS_LIST.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedBrand === brand
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
