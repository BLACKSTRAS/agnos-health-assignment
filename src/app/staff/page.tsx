'use client';

import { useMemo, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  User, Activity, Clock, ClipboardList, Users,
  Search, Filter, HeartPulse,
  Phone, MapPin, Calendar, Globe, Fingerprint,
  Trash2, AlertTriangle, ArrowLeft
} from 'lucide-react';

interface PatientDBRecord {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  preferred_language: string;
  nationality: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  religion: string | null;
  status: 'idle' | 'filling' | 'submitted';
  updated_at: string;
}

const HIDE_SCROLL = "overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function StaffPage() {
  const [patients, setPatients] = useState<PatientDBRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchPatients();

    const channel = supabase
      .channel(`staff-view-all-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchPatients();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .order('updated_at', { ascending: false });
    if (data) setPatients(data as PatientDBRecord[]);
  };

  const confirmDelete = async () => {
    if (!activePatient) return;
    const { error } = await supabase.from('patients').delete().eq('id', activePatient.id);
    if (!error) {
      setSelectedId(null);
      setShowDeleteModal(false);
      setShowMobileDetails(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return patients.filter(p =>
      (p.first_name?.toLowerCase().includes(lowerQ) || '') ||
      (p.last_name?.toLowerCase().includes(lowerQ) || '') ||
      (p.id?.toLowerCase().includes(lowerQ) || '')
    );
  }, [patients, searchQuery]);

  const activePatient = useMemo(() => {
    if (!selectedId && filteredPatients.length > 0) return filteredPatients[0];
    return filteredPatients.find(p => p.id === selectedId) || filteredPatients[0];
  }, [selectedId, filteredPatients]);

  const lastUpdateTime = useMemo(() => {
    if (!activePatient?.updated_at) return '--:--';
    return new Date(activePatient.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, [activePatient]);

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const calculateProgress = (p: PatientDBRecord | null) => {
    if (!p) return 0;
    if (p.status === 'submitted') return 100;
    const fieldsToCheck = [
      p.first_name, p.last_name, p.date_of_birth, p.gender,
      p.phone_number, p.email, p.nationality, p.address, p.preferred_language
    ];
    const filledCount = fieldsToCheck.filter(field => field && field.trim() !== '').length;
    return Math.round((filledCount / fieldsToCheck.length) * 100);
  };

  const activeProgress = calculateProgress(activePatient);

  if (!isMounted) return null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex justify-center p-0 sm:p-4 lg:p-6 relative">
      <div className="w-full max-w-[1600px] flex flex-col lg:flex-row items-start gap-0 sm:gap-6">
        <aside className={`w-full lg:w-96 flex flex-col bg-white sm:rounded-3xl shadow-sm border-x sm:border border-slate-200/80 shrink-0 ${showMobileDetails ? 'hidden lg:flex' : 'flex'} lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] h-screen lg:overflow-hidden`}>
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-white/95 backdrop-blur-md z-20 shrink-0 pt-8 sm:pt-6 sticky top-0 sm:rounded-t-3xl lg:static">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                <h3 className="font-black text-slate-900 tracking-tight text-lg">รายชื่อผู้ป่วย (Directory)</h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Live</span>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือ ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className={`flex-1 p-3 space-y-1 pb-6 ${HIDE_SCROLL}`}>
            {filteredPatients.map((p) => {
              const isSelected = (selectedId === p.id || (!selectedId && filteredPatients[0]?.id === p.id));
              const progress = calculateProgress(p);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    setShowMobileDetails(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full p-4 text-left rounded-2xl transition-all flex items-center justify-between group ${isSelected ? 'bg-slate-900 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <div className="flex flex-col gap-1.5 overflow-hidden pr-3">
                    <span className="font-bold truncate text-sm">
                      {p.first_name ? `${p.first_name} ${p.last_name}` : 'รอข้อมูล... (Awaiting)'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                        {p.id.split('-')[0].toUpperCase()}
                      </span>
                      {p.status !== 'submitted' && progress > 0 && (
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-blue-300' : 'text-blue-500'}`}>{progress}%</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <StatusDot status={p.status} />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {new Date(p.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </button>
              );
            })}
            {filteredPatients.length === 0 && (
              <div className="flex flex-col items-center justify-center text-slate-400 opacity-60 p-10 text-center h-40">
                <Filter size={32} className="mb-3" />
                <p className="text-sm font-bold">ไม่พบข้อมูล (No records)</p>
              </div>
            )}
          </div>
        </aside>

        <main className={`flex-1 w-full flex-col gap-4 sm:gap-6 pb-6 ${!showMobileDetails ? 'hidden lg:flex' : 'flex min-h-screen lg:min-h-0'}`}>
          {!activePatient ? (
            <div className="bg-white sm:rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 min-h-[500px]">
              <Activity size={48} className="mb-4 text-slate-200" />
              <p className="font-bold text-lg text-slate-500">Awaiting Patient Connection</p>
              <p className="text-sm mt-1">Select a patient from the directory to view details.</p>
            </div>
          ) : (
            <>
              <div className="lg:hidden shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 pt-8 flex items-center gap-3 sticky top-0 z-20">
                <button onClick={() => setShowMobileDetails(false)} className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <span className="font-black text-slate-900 tracking-tight">กลับไปหน้ารายชื่อ</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-0">
                <StatCard className="col-span-2 md:col-span-1" icon={<Activity size={16} className="text-blue-500" />} title="สถานะ (Status)">
                  <StatusBadge status={activePatient.status} progress={activeProgress} />
                </StatCard>
                <StatCard icon={<Clock size={16} className="text-emerald-500" />} title="อัปเดตล่าสุด" value={lastUpdateTime} />
                <StatCard icon={<Fingerprint size={16} className="text-purple-500" />} title="System ID" value={activePatient.id.split('-')[0].toUpperCase()} subtitle="EHR Record" />
              </div>
              <div className="bg-white sm:rounded-3xl shadow-sm border-x sm:border border-slate-200/80 mb-6 lg:mb-0 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:rounded-t-3xl">
                  <div className="flex items-center gap-4 sm:gap-5 w-full">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                      <User size={28} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 truncate">
                        {activePatient.first_name ? `${activePatient.first_name} ${activePatient.middle_name ? activePatient.middle_name + ' ' : ''}${activePatient.last_name}` : 'Unknown Patient'}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {activePatient.date_of_birth || 'N/A'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>อายุ: {calculateAge(activePatient.date_of_birth)} ปี</span>
                        <span className="hidden sm:inline">•</span>
                        <span className={activePatient.gender === 'male' ? 'text-blue-600' : activePatient.gender === 'female' ? 'text-pink-600' : ''}>
                          {activePatient.gender ? activePatient.gender : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                    <button onClick={() => setShowDeleteModal(true)} className="flex-1 xl:flex-none justify-center flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors active:scale-[0.98]">
                      <Trash2 size={14} /> ลบข้อมูล
                    </button>
                    <div className="flex-1 xl:flex-none justify-center flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-not-allowed opacity-60">
                      <ClipboardList size={14} /> พิมพ์ประวัติ (Print)
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 space-y-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
                      <Globe size={14} className="text-blue-500" /> ข้อมูลประชากร & ติดต่อ
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                      <DataCard label="สัญชาติ (Nationality)" value={activePatient.nationality} />
                      <DataCard label="ศาสนา (Religion)" value={activePatient.religion} />
                      <DataCard label="เบอร์โทร (Phone)" value={activePatient.phone_number} icon={<Phone size={12} />} />
                      <DataCard label="อีเมล (Email)" value={activePatient.email} />
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
                      <MapPin size={14} className="text-blue-500" /> ที่อยู่ & การสื่อสาร
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed break-words">
                        {activePatient.address || <span className="text-slate-400 italic">No address provided.</span>}
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-200/60">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">ภาษาที่สะดวก (Language)</span>
                        <span className="text-sm font-bold text-slate-800">{activePatient.preferred_language || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
                      <HeartPulse size={14} className="text-red-500" /> ข้อมูลผู้ติดต่อฉุกเฉิน
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-red-50/50 rounded-2xl p-4 sm:p-5 border border-red-100/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400 block mb-1">ชื่อผู้ติดต่อ (Name)</span>
                        <span className="text-sm font-bold text-slate-900 truncate block">{activePatient.emergency_contact_name || '—'}</span>
                      </div>
                      <div className="bg-red-50/50 rounded-2xl p-4 sm:p-5 border border-red-100/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400 block mb-1">ความสัมพันธ์ (Relationship)</span>
                        <span className="text-sm font-bold text-slate-900 truncate block">{activePatient.emergency_contact_relationship || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {showDeleteModal && activePatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 tracking-tight">ยืนยันการลบข้อมูล?</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Delete Confirmation</p>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              คุณต้องการลบข้อมูลประวัติของ<br />
              <strong className="text-slate-900">{activePatient.first_name} {activePatient.last_name}</strong> หรือไม่?<br />
              <span className="text-xs italic mt-2 block text-red-400">(การกระทำนี้ไม่สามารถกู้คืนได้)</span>
            </p>
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100">
                ยกเลิก (Cancel)
              </button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 flex items-center justify-center gap-2">
                <Trash2 size={16} /> ลบ (Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, title, value, subtitle, children, className = "" }: any) => (
  <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[85px] ${className}`}>
    <div className="flex items-center gap-2 text-slate-500 mb-2">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
    </div>
    {children ? children : (
      <div className="flex items-end justify-between">
        <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate pr-2">{value || '--'}</p>
        {subtitle && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
      </div>
    )}
  </div>
);

const StatusBadge = ({ status, progress }: any) => {
  const isSub = status === 'submitted';
  const isFill = status === 'filling';
  return (
    <div className="flex flex-col gap-2 mt-1 w-full">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isSub ? 'bg-emerald-500' : isFill ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
        <span className="font-black text-slate-900 uppercase text-[10px] tracking-tight">
          {isSub ? 'ส่งสำเร็จ (Verified)' : isFill ? `กำลังพิมพ์... ${progress}%` : 'รอข้อมูล (Awaiting)'}
        </span>
      </div>
      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-500 ${isSub ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

const StatusDot = ({ status }: any) => {
  const colors = { submitted: 'bg-emerald-500', filling: 'bg-amber-500 animate-pulse', idle: 'bg-slate-300' };
  return <div className={`w-2 h-2 rounded-full ${(colors as any)[status] || colors.idle}`} />;
};

const DataCard = ({ label, value, icon }: any) => (
  <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{value || '—'}</p>
  </div>
);