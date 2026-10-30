'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const emptySubscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const categoryLinks = [
    { name: 'Fast Chargers', href: '/category/fast-chargers' },
    { name: 'Wireless Earbuds', href: '/category/earbuds' },
    { name: 'Headphones', href: '/category/headphones' },
    { name: 'Keyboards', href: '/category/keyboards' },
    { name: 'Mice & Gaming', href: '/category/mice' },
    { name: 'Wireless Docks', href: '/category/wireless-devices' },
    { name: 'USB & Flash Drives', href: '/category/usb-drives' },
    { name: 'Power Banks', href: '/category/power-banks' },
    { name: 'Durable Cables', href: '/category/cables' },
  ];

  const mainLinks = [
    { name: 'Shop Directory', href: '/shops' },
    { name: 'All Products', href: '/category/all' },
    { name: 'Trending', href: '/#trending' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="bg-white/85 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 group">
                <span className="bg-black text-white px-2.5 py-1 rounded-lg text-sm
                 md:text-base font-extrabold group-hover:bg-gray-800 transition-colors">Tech</span>
                <span className="text-gray-900 text-lg md:text-xl font-black tracking-wider">GEAR</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {/* Category dropdown */}
              <div className="relative group py-2">
                <button className="text-sm font-medium text-gray-700 hover:text-black transition-colors flex items-center gap-1.5 py-1">
                  Categories
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 mt-1 z-50">
                  {categoryLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    href="/category/all"
                    className="block px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50/50"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>

              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
                      }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search, Cart, Account */}
            <div className="hidden md:flex items-center space-x-5">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="pl-10 pr-4 py-2 bg-gray-100 hover:bg-gray-100/80 focus:bg-white border border-transparent focus:border-gray-300 focus:ring-2 focus:ring-gray-100 rounded-full text-sm w-56 lg:w-64 transition-all outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-black transition-colors" />
              </form>

              <Link
                href="/profile"
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                title="Account Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors relative"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-scale-up">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <Link href="/cart" className="p-2 text-gray-700 hover:text-black relative">
                <ShoppingCart className="w-6 h-6" />
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              <button
                className="p-2 text-gray-700 hover:text-black rounded-lg focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-5 h-16 border-b border-gray-100">
              <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="bg-black text-white px-2 py-0.5 rounded-md text-sm">Tech</span>
                <span className="text-black font-black">GEAR</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-black p-1 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-5 py-6 overflow-y-auto flex-grow flex flex-col gap-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </form>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
                {categoryLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-800 py-2.5 border-b border-gray-50 flex items-center justify-between hover:text-black"
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</h3>
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-700 py-2 border-b border-gray-50 hover:text-black"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-medium shadow-sm hover:bg-black transition-colors"
                >
                  <User className="w-5 h-5" /> My Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
