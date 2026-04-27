'use client';

import Link from "next/link";
import {
    UserPlus,
    LayoutDashboard,
    Zap,
    ShieldCheck,
    ArrowRight,
    Monitor,
    Activity,
    Globe,
    Database
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="relative isolate overflow-hidden">
            {/* Background Decorative Elements - ทำให้ดูมีมิติแบบแอปสมัยใหม่ */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#60a5fa] to-[#2563eb] opacity-10 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
            </div>

            <div className="max-w-6xl mx-auto py-20 px-6 lg:py-32">

                {/* --- Hero Section --- */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System v2.0 Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
                        Intelligent Patient <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Management.</span>
                    </h1>

                    <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                        Next-generation healthcare infrastructure providing seamless real-time
                        synchronization between patient intake and clinical monitoring.
                    </p>
                </div>

                {/* --- Action Bento Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">

                    {/* Patient Entry Card */}
                    <Link href="/patient" className="group relative overflow-hidden bg-slate-900 rounded-3xl p-10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-20 shadow-lg group-hover:scale-110 transition-transform">
                                <UserPlus className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Registration Portal</h3>
                            <p className="text-slate-400 mb-8 max-w-70">
                                Secure intake form with instant auto-save and biometric data verification.
                            </p>
                            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                                GO TO REGISTRATION <ArrowRight size={16} />
                            </div>
                        </div>
                        {/* Background Pattern */}
                        <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={300} className="text-white" />
                        </div>
                    </Link>

                    {/* Staff Monitor Card */}
                    <Link href="/staff" className="group relative overflow-hidden bg-white rounded-3xl p-10 border border-slate-200 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center mb-20 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <LayoutDashboard size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Staff Dashboard</h3>
                            <p className="text-slate-500 mb-8 max-w-70">
                                Unified monitoring interface for healthcare providers to track live submissions.
                            </p>
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                OPEN DASHBOARD <ArrowRight size={16} />
                            </div>
                        </div>
                        {/* Background Pattern */}
                        <div className="absolute right-[-10%] top-[-10%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Monitor size={300} className="text-slate-900" />
                        </div>
                    </Link>
                </div>

                {/* --- Trust & Tech Bar --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-slate-200 pt-16">
                    <FeatureItem
                        icon={<Zap size={20} className="text-blue-600" />}
                        title="Real-time"
                        value="0.5s Latency"
                    />
                    <FeatureItem
                        icon={<ShieldCheck size={20} className="text-blue-600" />}
                        title="Security"
                        value="End-to-End"
                    />
                    <FeatureItem
                        icon={<Database size={20} className="text-blue-600" />}
                        title="Backbone"
                        value="Supabase DB"
                    />
                    <FeatureItem
                        icon={<Globe size={20} className="text-blue-600" />}
                        title="Availability"
                        value="99.9% Uptime"
                    />
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
    );
}