"use client"
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            PashuCare <span className="text-red-500">AI</span>
          </span>
        </div>

        {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="#" className="hover:text-red-500 transition-colors">How it works</Link>
          <Link href="#" className="hover:text-red-500 transition-colors">Features</Link>
          <Link href="#" className="hover:text-red-500 transition-colors">About</Link>
        </div> */}

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 text-sm font-semibold text-white hover:text-red-500 transition-colors">
            Login
          </button>
          <button className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-95">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
