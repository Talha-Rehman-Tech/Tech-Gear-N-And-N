import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-black text-white px-2 py-1 rounded-md text-lg">Tech</span>
              <span className="text-black">Gear</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium mobile accessories designed to enhance your digital lifestyle. Quality you can trust.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Shop & Explore</h3>
              <ul className="space-y-2.5">
                <li><Link href="/shops" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">📍 Shop Directory (581+)</Link></li>
                <li><Link href="/category/earbuds" className="text-sm text-gray-500 hover:text-black transition-colors">Wireless Earbuds &amp; Buds</Link></li>
                <li><Link href="/category/headphones" className="text-sm text-gray-500 hover:text-black transition-colors">Over-Ear Headphones</Link></li>
                <li><Link href="/category/keyboards" className="text-sm text-gray-500 hover:text-black transition-colors">Keyboards</Link></li>
                <li><Link href="/category/mice" className="text-sm text-gray-500 hover:text-black transition-colors">Gaming &amp; Office Mice</Link></li>
                <li><Link href="/category/wireless-devices" className="text-sm text-gray-500 hover:text-black transition-colors">Wireless Devices &amp; Docks</Link></li>
                <li><Link href="/category/usb-drives" className="text-sm text-gray-500 hover:text-black transition-colors">USB &amp; Flash Drives</Link></li>
                <li><Link href="/category/fast-chargers" className="text-sm text-gray-500 hover:text-black transition-colors">Fast Chargers</Link></li>
                <li><Link href="/category/power-banks" className="text-sm text-gray-500 hover:text-black transition-colors">Power Banks &amp; Cables</Link></li>
              </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-500 hover:text-black transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-sm text-gray-500 hover:text-black transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/warranty" className="text-sm text-gray-500 hover:text-black transition-colors">Warranty</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-500 mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-gray-50 border border-gray-200 text-sm rounded-md px-3 py-2 w-full outline-none focus:border-black transition-colors" />
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">Subscribe</button>
            </div>
          </div>

        </div>

            {/* Project Attribution Banner */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-500">
                <span>&copy; {new Date().getFullYear()} TechGear. All rights reserved.</span>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span className="font-medium text-gray-700">
                  Made with <span className="text-red-500">❤️</span> by <strong className="text-gray-900 font-bold">Talha Rehman</strong> &amp; <strong className="text-gray-900 font-bold">Rana Ali</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 shadow-2xs">
                  🎓 Project Assigned by <strong className="font-extrabold text-blue-950">Dr. Nadeem Nazir</strong> Sir
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 shadow-2xs">
                  ✓ Cash on Delivery Available
                </span>
              </div>
            </div>
          </div>
        </footer>
        );
}
