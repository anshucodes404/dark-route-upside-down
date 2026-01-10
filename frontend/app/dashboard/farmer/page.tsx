"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useApi } from "@/context/ApiContext";

interface DashboardStats {
  presentCount: number;
  absentPercentage: number;
  flaggedCount: number;
  syncStatus: string;
}

export default function FarmerDashboard() {
  const { api } = useApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}/animal/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Safely parse JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned an invalid response. Please check if you are logged in.");
      }

      const result = await response.json();
      if (response.ok) {
        setStats(result.data);
      } else {
        setError(result.message || "Failed to fetch stats");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Networking error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [api]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                Farmer <span className="text-red-600">Dashboard</span>
              </h1>
              <p className="text-zinc-400 font-medium">Monitoring your livestock health and attendance</p>
            </div>
            
            <button 
              onClick={fetchStats}
              disabled={isLoading}
              className="group flex items-center gap-3 px-6 py-3 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-zinc-800/80 transition-all active:scale-95 disabled:opacity-50"
            >
              <div className={`w-3 h-3 rounded-full ${stats?.syncStatus === 'Synced' ? 'bg-green-500 box-shadow-green' : 'bg-yellow-500 animate-pulse'}`}></div>
              <span className="text-sm font-bold tracking-wide uppercase text-zinc-300">
                {isLoading ? "Syncing..." : stats?.syncStatus || "Check Sync"}
              </span>
              <svg className={`w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Attendance Card */}
            <div className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] transition-all hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-10 -mt-10 blur-3xl" />
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-3xl">
                  📊
                </div>
                <div>
                  <h3 className="text-zinc-400 font-semibold mb-1">Today&apos;s Attendance</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">
                      {isLoading ? "..." : stats?.presentCount ?? 0}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Animals</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out"
                    style={{ width: isLoading ? '0%' : `${100 - (stats?.absentPercentage || 0)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Absent Card */}
            <div className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] transition-all hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-10 -mt-10 blur-3xl" />
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-3xl">
                  ❌
                </div>
                <div>
                  <h3 className="text-zinc-400 font-semibold mb-1">Absent Percentage</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-red-600">
                       {isLoading ? "..." : stats?.absentPercentage ?? 0}%
                    </span>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm font-medium">Needs attention immediately</p>
              </div>
            </div>

            {/* Present Card */}
            <div className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] transition-all hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-10 -mt-10 blur-3xl" />
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-3xl">
                  🟢
                </div>
                <div>
                  <h3 className="text-zinc-400 font-semibold mb-1">Present Count</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">
                      {isLoading ? "..." : stats?.presentCount ?? 0}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.204-2.326-.582-3.388a1 1 0 00-1.455-.385c-.352.235-.632.576-.85 1.015-.224.453-.41 1.008-.553 1.583a15.82 15.82 0 01-.482 1.488 15.7 15.7 0 00-.416-3.877c-.161-.951-.433-1.93-.81-2.825a6.6 6.6 0 00-.507-1.037 1 1 0 00-.455-.385z" clipRule="evenodd" />
                   </svg>
                   Normal behavior detected
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Alerts Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-red-600/5 rounded-[3rem] blur-2xl transition-all group-hover:bg-red-600/10 pointer-events-none" />
            <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
               <div className="absolute top-0 right-12 w-32 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
               
               <div className="flex items-center gap-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-red-600/20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner">
                      🚩
                    </div>
                    {stats && stats.flaggedCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 border-4 border-black rounded-full flex items-center justify-center text-xs font-black animate-pulse">
                        {stats.flaggedCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Flagged Animals</h2>
                    <p className="text-zinc-400 font-medium">
                      {stats && stats.flaggedCount > 0 
                        ? `${stats.flaggedCount} animals require medical assessment` 
                        : "Everything looks good today!"}
                    </p>
                  </div>
               </div>

               <button className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-900/20 hover:shadow-red-600/20 active:scale-95 flex items-center gap-3 group/btn">
                  View Details
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
               </button>
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-center font-bold animate-pulse">
               ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .box-shadow-green {
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </main>
  );
}
