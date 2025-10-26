import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Name */}
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          KnightSource
        </Link>
        
        {/* Login Button */}
        <button className="bg-ucf-gold text-ucf-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
          Login
        </button>
      </div>
    </nav>
  );
}