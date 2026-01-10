"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApi } from "@/context/ApiContext";

export default function Login() {
  const router = useRouter();
  const { api } = useApi();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  type loginSchema = {
    phone: string;
    password: string;
  };

  const form = useForm<loginSchema>();
  const { register, handleSubmit, setError, formState: { errors } } = form;

  const onSubmit = async (data: loginSchema) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${api}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login Successful", result);
        const userRole = result.data?.role;
        
        if (userRole === "farmer") {
          router.push("/dashboard/farmer");
        } else if (userRole === "vet") {
          router.push("/dashboard/vet");
        } else {
          router.push("/");
        }
        
        router.refresh();
      } else if (response.status === 400) {
        if (result.err && result.err.issues) {
          result.err.issues.forEach((issue: any) => {
            const field = issue.path[0] as keyof loginSchema;
            setError(field, {
              type: "manual",
              message: issue.message
            });
          });
        } else {
          setErrorMessage(result.message || "Invalid credentials");
        }
      } else if (response.status === 401 || response.status === 404) {
        setErrorMessage(result.message || "Invalid phone number or password.");
      } else {
        setErrorMessage(result.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Networking error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative">
            <div className="absolute top-0 right-12 w-24 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                Welcome <span className="text-red-500">Back</span>
              </h1>
              <p className="text-gray-400 text-sm">Log in to manage your livestock</p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="10 digit number"
                  {...register("phone", { 
                      required: "Phone number is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" }
                  })}
                  className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.phone ? 'border-red-500' : 'border-white/5'} rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all placeholder:text-gray-600 text-sm`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                  <Link href="#" className="text-[10px] text-red-500 hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    {...register("password", { required: "Password is required" })}
                    className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.password ? 'border-red-500' : 'border-white/5'} rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all placeholder:text-gray-600 text-sm pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-red-900/30 active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-sm">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    <>
                      Log In
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-red-500 hover:underline font-medium">
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
