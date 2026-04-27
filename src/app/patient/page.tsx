'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePatient } from '@/store/PatientContext';
import {
    User, Phone, MapPin, HeartPulse, ChevronRight,
    ChevronLeft, CheckCircle2, ShieldCheck,
    AlertCircle, Info, Calendar, Check
} from 'lucide-react';

const STEPS = [
    { id: 'identity', label: 'ข้อมูลส่วนตัว (Identity)', shortLabel: 'Identity', icon: User },
    { id: 'contact', label: 'ข้อมูลติดต่อ (Contact)', shortLabel: 'Contact', icon: Phone },
    { id: 'preferences', label: 'การสื่อสาร (Communication)', shortLabel: 'Communication', icon: MapPin },
    { id: 'emergency', label: 'ติดต่อฉุกเฉิน (Support)', shortLabel: 'Support', icon: HeartPulse }
];

const THEME = {
    card: "bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden flex flex-col",
    input: "w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 transition-all focus:outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-400 font-medium text-sm sm:text-base",
    inputError: "border-red-200 bg-red-50/30 focus:border-red-500",
    label: "block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1",
    errorText: "text-[10px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1",
    btnPrimary: "flex items-center justify-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200 text-sm sm:text-base",
    btnSecondary: "flex items-center justify-center gap-2 bg-white text-slate-500 border-2 border-slate-100 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98] text-sm sm:text-base"
};

const formatName = (val: string) => {
    const cleaned = val.replace(/[^a-zA-Zก-๙\s-]/g, '');
    return cleaned.replace(/\b\w/g, char => char.toUpperCase());
};
const formatPhone = (val: string) => val.replace(/\D/g, '').slice(0, 10);
const formatEmail = (val: string) => val.toLowerCase().replace(/\s/g, '');

export default function PatientPage() {
    const { patientData, updateField, updateEmergencyContact, setStatus, resetForm } = usePatient();
    const [currentStep, setCurrentStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => setMounted(true), []);
    const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

    const validateStep = () => {
        const newErrors: Record<string, string> = {};
        if (currentStep === 0) {
            if (!patientData.firstName.trim()) newErrors.firstName = "กรุณากรอกข้อมูล (Required)";
            if (!patientData.lastName.trim()) newErrors.lastName = "กรุณากรอกข้อมูล (Required)";
            if (!patientData.dateOfBirth) newErrors.dateOfBirth = "กรุณาระบุวันเกิด (Required)";
            if (!patientData.gender) newErrors.gender = "กรุณาระบุเพศ (Required)";
        } else if (currentStep === 1) {
            if (!patientData.nationality.trim()) newErrors.nationality = "กรุณากรอกข้อมูล (Required)";
            if (patientData.phoneNumber && patientData.phoneNumber.length < 9) {
                newErrors.phoneNumber = "ต้องมี 9-10 หลัก (Must be 9-10 digits)";
            }
            if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
                newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง (Invalid email)";
            }
        } else if (currentStep === 2) {
            if (!patientData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่ (Address required)";
            if (!patientData.preferredLanguage) newErrors.preferredLanguage = "กรุณาระบุภาษา (Required)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(s => s + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setStatus('submitted');
                setShowSuccessModal(true);
            }
        }
    };

    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        if (resetForm) resetForm();
        setCurrentStep(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const progress = useMemo(() => ((currentStep + 1) / STEPS.length) * 100, [currentStep]);
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6 lg:py-16 flex flex-col relative">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                <nav className="mb-8 sm:mb-12 shrink-0">
                    <div className="flex justify-between items-end mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">ลงทะเบียนผู้ป่วย</h2>
                            <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-1 uppercase tracking-widest">Patient Intake Form v2.1</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl sm:text-3xl font-black text-blue-600 leading-none">{Math.round(progress)}%</span>
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-tighter mt-1">Completion</p>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-blue-600 transition-all duration-700 ease-out relative" style={{ width: `${progress}%` }}>
                            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', transform: 'skewX(-20deg)' }}></div>
                        </div>
                    </div>
                </nav>

                <main className={THEME.card}>
                    <div className="flex flex-col lg:flex-row flex-1">
                        <aside className="hidden lg:flex w-72 bg-slate-50 border-r border-slate-100 p-10 flex-col justify-between shrink-0">
                            <div className="space-y-8">
                                {STEPS.map((step, idx) => (
                                    <div key={step.id} className={`flex items-center gap-4 transition-all duration-300 ${idx === currentStep ? 'translate-x-2' : 'opacity-40'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${idx === currentStep ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                            <step.icon size={18} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-900">{step.shortLabel}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-10 border-t border-slate-200">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <ShieldCheck size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Secure Data</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">ข้อมูลของคุณถูกเข้ารหัสความปลอดภัยระดับมาตรฐานสากล (AES-256)</p>
                            </div>
                        </aside>

                        <div className="lg:hidden bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                                {(() => {
                                    const Icon = STEPS[currentStep].icon;
                                    return <Icon size={18} />;
                                })()}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">Step {currentStep + 1} of {STEPS.length}</p>
                                <h3 className="text-sm font-bold text-slate-900">{STEPS[currentStep].shortLabel}</h3>
                            </div>
                        </div>

                        <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                            <div className="flex-1">
                                {currentStep === 0 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <StepHeader title={STEPS[0].label} desc="โปรดระบุข้อมูลตามบัตรประชาชน (Please provide your legal name and details.)" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                            <Input label="ชื่อจริง (First Name) *" value={patientData.firstName} error={errors.firstName} onChange={(v) => updateField('firstName', formatName(v))} maxLength={50} />
                                            <Input label="ชื่อกลาง (Middle Name) - หากมี" value={patientData.middleName} onChange={(v) => updateField('middleName', formatName(v))} maxLength={50} />
                                            <div className="sm:col-span-2">
                                                <Input label="นามสกุล (Last Name) *" value={patientData.lastName} error={errors.lastName} onChange={(v) => updateField('lastName', formatName(v))} maxLength={50} />
                                            </div>
                                            <DateInput label="วัน/เดือน/ปีเกิด (Date of Birth) *" max={todayISO} value={patientData.dateOfBirth} error={errors.dateOfBirth} onChange={(v) => updateField('dateOfBirth', v)} />
                                            <Select label="เพศ (Gender) *" value={patientData.gender} error={errors.gender} onChange={(v) => updateField('gender', v)} options={['Male (ผู้ชาย)', 'Female (ผู้หญิง)', 'Other (อื่นๆ)']} />
                                            <div className="sm:col-span-2">
                                                <Input label="ศาสนา (Religion) - ระบุหรือไม่ก็ได้" value={patientData.religion} onChange={(v) => updateField('religion', formatName(v))} placeholder="e.g. พุทธ (Buddhism)" maxLength={30} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {currentStep === 1 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <StepHeader title={STEPS[1].label} desc="ข้อมูลสำหรับการติดต่อและยืนยันตัวตน (Details for identity verification.)" />
                                        <div className="space-y-5 sm:space-y-6">
                                            <Input label="เบอร์โทรศัพท์ (Phone Number)" type="tel" value={patientData.phoneNumber} error={errors.phoneNumber} onChange={(v) => updateField('phoneNumber', formatPhone(v))} placeholder="08X-XXX-XXXX" maxLength={10} />
                                            <Input label="อีเมล (Email Address)" type="email" value={patientData.email} error={errors.email} onChange={(v) => updateField('email', formatEmail(v))} placeholder="name@example.com" maxLength={100} />
                                            <Input label="สัญชาติ (Nationality) *" value={patientData.nationality} error={errors.nationality} onChange={(v) => updateField('nationality', formatName(v))} placeholder="e.g. ไทย (Thai)" maxLength={50} />
                                        </div>
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <StepHeader title={STEPS[2].label} desc="ที่อยู่ปัจจุบันและภาษาที่สะดวกในการสื่อสาร (Residence and language preferences.)" />
                                        <div className="space-y-5 sm:space-y-6">
                                            <div>
                                                <label className={THEME.label}>ที่อยู่ปัจจุบัน (Full Residential Address) *</label>
                                                <textarea
                                                    className={`${THEME.input} ${errors.address ? THEME.inputError : ''} min-h-30 resize-none py-4`}
                                                    value={patientData.address}
                                                    onChange={e => updateField('address', e.target.value)}
                                                    maxLength={300}
                                                    placeholder="บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                                                />
                                                {errors.address && <p className={THEME.errorText}><AlertCircle size={12} /> {errors.address}</p>}
                                            </div>
                                            <Select label="ภาษาที่สะดวกในการสื่อสาร (Preferred Language) *" value={patientData.preferredLanguage} error={errors.preferredLanguage} onChange={(v) => updateField('preferredLanguage', v)} options={['Thai (ภาษาไทย)', 'English (ภาษาอังกฤษ)', 'Chinese (ภาษาจีน)', 'Japanese (ภาษาญี่ปุ่น)']} />
                                        </div>
                                    </div>
                                )}
                                {currentStep === 3 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <StepHeader title={STEPS[3].label} desc="บุคคลที่สามารถติดต่อได้ในกรณีฉุกเฉิน (Someone we can reach in urgent situations.)" />
                                        <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 flex gap-3 sm:gap-4 border border-slate-100">
                                            <Info className="text-blue-500 shrink-0" size={20} />
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                                การให้ข้อมูลผู้ติดต่อฉุกเฉิน จะช่วยให้ทีมแพทย์ดูแลและจัดการสถานการณ์ได้อย่างมีประสิทธิภาพมากขึ้น<br />
                                                (Providing emergency contact data helps our team manage your care more effectively.)
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                            <Input label="ชื่อผู้ติดต่อฉุกเฉิน (Contact Person Name) - ระบุหรือไม่ก็ได้" value={patientData.emergencyContact.name} onChange={(v) => updateEmergencyContact('name', formatName(v))} placeholder="ชื่อ-นามสกุล" maxLength={100} />
                                            <Input label="ความสัมพันธ์ (Relationship) - ระบุหรือไม่ก็ได้" value={patientData.emergencyContact.relationship} onChange={(v) => updateEmergencyContact('relationship', formatName(v))} placeholder="เช่น บิดา, มารดา, สามี, ภรรยา" maxLength={30} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-10 sm:mt-12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
                                <button
                                    onClick={() => {
                                        setCurrentStep(s => Math.max(0, s - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`${THEME.btnSecondary} ${currentStep === 0 ? 'hidden sm:invisible' : 'flex'}`}
                                >
                                    <ChevronLeft size={18} /> <span className="sm:hidden">ย้อนกลับ (Back)</span>
                                </button>
                                <button onClick={handleNext} className={`${THEME.btnPrimary} flex-1 sm:flex-none`}>
                                    {currentStep === STEPS.length - 1 ? (
                                        <>ยืนยันส่งข้อมูล (SUBMIT) <CheckCircle2 size={18} /></>
                                    ) : (
                                        <>ถัดไป (NEXT) <ChevronRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="mt-8 text-center pb-8 shrink-0">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Health Information System Compliance</p>
                </footer>
            </div>
            {showSuccessModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-4xl p-8 sm:p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[#E8F8F0] flex items-center justify-center mb-6">
                            <Check className="text-[#00B873]" size={36} strokeWidth={3.5} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 tracking-tight">ส่งข้อมูลสำเร็จ</h3>
                        <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Submission Successful</p>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">
                            ข้อมูลของคุณถูกส่งเข้าระบบเรียบร้อยแล้ว<br />และกำลังได้รับการดำเนินการ<br />
                            <span className="text-xs italic mt-2 block opacity-70">(Your data is now being processed.)</span>
                        </p>
                        <button
                            onClick={handleSuccessConfirm}
                            className="w-full px-4 py-3.5 rounded-2xl font-bold text-white bg-[#00B873] hover:bg-[#00a366] transition-all active:scale-[0.98] shadow-lg shadow-emerald-200/50 text-sm sm:text-base"
                        >
                            ตกลง (OK)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const StepHeader = ({ title, desc }: { title: string; desc: string }) => (
    <div className="mb-6 sm:mb-10">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{desc}</p>
    </div>
);

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    error?: string;
    value?: string;
    onChange: (value: string) => void;
}

const Input = ({ label, error, onChange, value, ...props }: FieldProps) => (
    <div className="w-full">
        <label className={THEME.label}>{label}</label>
        <input
            {...props}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={`${THEME.input} ${error ? THEME.inputError : ''}`}
        />
        {error && <p className={THEME.errorText}><AlertCircle size={12} /> {error}</p>}
    </div>
);

const DateInput = ({ label, error, onChange, value, ...props }: FieldProps) => (
    <div className="w-full relative">
        <label className={THEME.label}>{label}</label>
        <div className="relative flex items-center">
            <Calendar className="absolute left-4 sm:left-5 text-slate-400 pointer-events-none" size={18} />
            <input
                {...props}
                type="date"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className={`${THEME.input} pl-11 sm:pl-12 pr-4 ${error ? THEME.inputError : ''} 
                [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute 
                [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full 
                [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            />
        </div>
        {error && <p className={THEME.errorText}><AlertCircle size={12} /> {error}</p>}
    </div>
);

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label: string;
    options: string[];
    error?: string;
    value?: string;
    onChange: (value: string) => void;
}

const Select = ({ label, options, error, onChange, value, ...props }: SelectProps) => (
    <div className="w-full">
        <label className={THEME.label}>{label}</label>
        <div className="relative">
            <select
                {...props}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className={`${THEME.input} ${error ? THEME.inputError : ''} appearance-none cursor-pointer pr-10`}
            >
                <option value="">โปรดเลือก (Select Option)</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
        {error && <p className={THEME.errorText}><AlertCircle size={12} /> {error}</p>}
    </div>
);