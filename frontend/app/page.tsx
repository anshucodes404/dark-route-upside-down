"use client"
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect } from "react";
import { useApi } from "@/context/ApiContext";

export default function Home() {
  const { api } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${api}`, { method: "GET" });
        const data = await res.json();
        console.log("API Response:", data);
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
    };

    fetchData();
  }, [api]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 pb-12 flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-cattle.png"
            alt="Farmer digitally tracking cattle"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Powered by Advanced AI
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Transforming traditional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                livestock management
              </span> <br />
              with AI-based analysis.
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              Detect animals, track attendance, and identify health issues 
              automatically—using just cameras and AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-8 py-4 bg-red-600 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40 active:scale-95 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Capture Animal
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              {/* <button className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-semibold text-lg transition-all active:scale-95">
                Watch Demo
              </button> */}
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-black opacity-60" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Trusted by <span className="text-white font-bold">500+</span> progressive farmers
              </p>
            </div>
          </div>
          
          <div className="hidden md:block relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative aspect-square rounded-2xl border border-white/10 overflow-hidden bg-zinc-900">
               <Image
                src="/images/hero-cattle.png"
                alt="AI Cattle Scanning"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-red-500/50 text-[10px] font-mono text-red-500 uppercase tracking-widest">
                System Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative pulse element */}
      <div className="fixed bottom-10 right-10 z-0">
        <div className="w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>
    </main>
  );
}