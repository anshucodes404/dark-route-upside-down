"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useApi } from "@/context/ApiContext";

interface Animal {
  _id: string;
  tagId: string;
  species?: string;
  breed?: string;
  present: boolean;
  attendanceLogs?: Date[];
  healthRecords: any[];
}

interface DashboardStats {
  presentCount: number;
  absentCount: number;
  totalAnimals: number;
  flaggedCount: number;
}

export default function FarmerDashboard() {
  const { api } = useApi();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}/farmer/all-attendance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned an invalid response. Please check if you are logged in.");
      }

      const result = await response.json();
      if (response.ok) {
        const animalData = result.data || [];
        setAnimals(animalData);
        
        // Calculate stats
        const presentCount = animalData.filter((a: Animal) => a.present).length;
        const totalAnimals = animalData.length;
        const absentCount = totalAnimals - presentCount;
        const flaggedCount = animalData.filter((a: Animal) => 
          a.healthRecords && a.healthRecords.some((h: any) => h.riskLevel === 'high' || h.riskLevel === 'medium')
        ).length;

        setStats({
          presentCount,
          absentCount,
          totalAnimals,
          flaggedCount,
        });
      } else {
        setError(result.message || "Failed to fetch animals");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Networking error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
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
              onClick={fetchAnimals}
              disabled={isLoading}
              className="group flex items-center gap-3 px-6 py-3 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-zinc-800/80 transition-all active:scale-95 disabled:opacity-50"
            >
              <div className={`w-3 h-3 rounded-full ${!isLoading ? 'bg-green-500 box-shadow-green' : 'bg-yellow-500 animate-pulse'}`}></div>
              <span className="text-sm font-bold tracking-wide uppercase text-zinc-300">
                {isLoading ? "Syncing..." : "Synced"}
              </span>
              <svg className={`w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Present Card */}
            <div className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] transition-all hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-10 -mt-10 blur-3xl" />
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-zinc-400 font-semibold mb-1">Present Today</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-green-500">
                      {isLoading ? "..." : stats?.presentCount ?? 0}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Animals</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out"
                    style={{ width: isLoading ? '0%' : `${stats ? (stats.presentCount / stats.totalAnimals * 100) : 0}%` }}
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
                  <h3 className="text-zinc-400 font-semibold mb-1">Absent Today</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-red-600">
                       {isLoading ? "..." : stats?.absentCount ?? 0}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Animals</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm font-medium">
                  {stats && stats.absentCount > 0 ? "Needs attention" : "All present!"}
                </p>
              </div>
            </div>

            {/* Flagged Card */}
            <div className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] transition-all hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-900/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-10 -mt-10 blur-3xl" />
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 bg-yellow-600/10 rounded-2xl flex items-center justify-center text-3xl">
                  🚩
                </div>
                <div>
                  <h3 className="text-zinc-400 font-semibold mb-1">Health Flagged</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-yellow-500">
                      {isLoading ? "..." : stats?.flaggedCount ?? 0}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Animals</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 text-sm font-bold">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                   Requires monitoring
                </div>
              </div>
            </div>
          </div>

          {/* Animals Table */}
          <div className="relative group">
            <div className="absolute inset-0 bg-red-600/5 rounded-[3rem] blur-2xl transition-all group-hover:bg-red-600/10 pointer-events-none" />
            <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 overflow-hidden">
               <div className="absolute top-0 right-12 w-32 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
               
               <div className="mb-6">
                 <h2 className="text-2xl font-bold mb-1">All Animals</h2>
                 <p className="text-zinc-400 font-medium">Complete livestock inventory and status</p>
               </div>

               {error && (
                 <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-center font-bold">
                    ⚠️ {error}
                 </div>
               )}

               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="border-b border-white/10">
                       <th className="text-left py-4 px-4 text-zinc-400 font-bold text-sm uppercase tracking-wider">Tag ID</th>
                       <th className="text-left py-4 px-4 text-zinc-400 font-bold text-sm uppercase tracking-wider">Species</th>
                       <th className="text-left py-4 px-4 text-zinc-400 font-bold text-sm uppercase tracking-wider">Breed</th>
                       <th className="text-center py-4 px-4 text-zinc-400 font-bold text-sm uppercase tracking-wider">Present</th>
                       <th className="text-center py-4 px-4 text-zinc-400 font-bold text-sm uppercase tracking-wider">Health Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {isLoading ? (
                       <tr>
                         <td colSpan={5} className="text-center py-12 text-zinc-500">
                           <div className="flex items-center justify-center gap-3">
                             <svg className="animate-spin h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             Loading animals...
                           </div>
                         </td>
                       </tr>
                     ) : animals.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="text-center py-12 text-zinc-500">
                           No animals found. Add animals to see them here.
                         </td>
                       </tr>
                     ) : (
                       animals.map((animal) => (
                         <tr key={animal._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                           <td className="py-4 px-4">
                             <span className="font-mono font-bold text-red-500">{animal.tagId}</span>
                           </td>
                           <td className="py-4 px-4">
                             <span className="text-white font-medium">{animal.species || "N/A"}</span>
                           </td>
                           <td className="py-4 px-4">
                             <span className="text-zinc-400">{animal.breed || "N/A"}</span>
                           </td>
                           <td className="py-4 px-4 text-center">
                             {animal.present ? (
                               <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                                 <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                 Present
                               </span>
                             ) : (
                               <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                                 <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                 Absent
                               </span>
                             )}
                           </td>
                           <td className="py-4 px-4 text-center">
                             <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                               <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                               </svg>
                               Pending
                             </span>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
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

