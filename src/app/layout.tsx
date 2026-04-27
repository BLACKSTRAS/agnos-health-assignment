import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { PatientProvider } from '@/store/PatientContext';
import {
  ShieldCheck,
  LayoutDashboard,
  UserPlus,
  Activity,
  Fingerprint
} from 'lucide-react';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "Agnos Health CMS | Intelligent Patient Portal",
  description: "Next-generation healthcare management and real-time patient monitoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827] antialiased">

        <header className="sticky top-0 z-100 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">

              <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-all">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-200">
                  <Activity className="text-white" size={20} strokeWidth={2.5} />
                  <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold leading-none tracking-tight text-slate-900">
                    AGNOS<span className="text-blue-600">.</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    System Intelligence
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1.5 sm:gap-3">
                <Link
                  href="/patient"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200"
                >
                  <UserPlus size={15} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
                  <span>REGISTRATION</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <Link
                  href="/staff"
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  <LayoutDashboard size={16} strokeWidth={2} />
                  <span className="hidden md:inline">STAFF PORTAL</span>
                </Link>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1">
          <PatientProvider>
            <div className="animate-in fade-in duration-700">
              {children}
            </div>
          </PatientProvider>
        </main>

        <footer className="bg-white border-t border-slate-200/60 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">

              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-5 text-slate-400">
                  <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 border border-slate-100">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AES-256 Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 border border-slate-100">
                    <Fingerprint size={14} className="text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GDPR Compliant</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-400">
                  © 2026 Agnos Health Solutions. Infrastructure for Modern Healthcare.
                </p>
              </div>

              <div className="flex justify-center md:justify-end gap-8">
                {['Security', 'Privacy', 'Status', 'API'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>

            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}