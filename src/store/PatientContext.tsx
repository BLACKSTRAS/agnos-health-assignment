'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';

// --- Types & Interfaces ---
export interface PatientData {
    id?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    preferredLanguage: string;
    nationality: string;
    emergencyContact: { name: string; relationship: string };
    religion?: string;
    status: 'idle' | 'filling' | 'submitted';
    lastUpdated: number;
}

interface PatientContextType {
    patientData: PatientData;
    updateField: <K extends keyof PatientData>(field: K, value: PatientData[K]) => void;
    updateEmergencyContact: (field: keyof PatientData['emergencyContact'], value: string) => void;
    setStatus: (status: PatientData['status']) => void;
    resetForm: () => void;
}

// --- Constants & Helpers ---
const INITIAL_STATE: PatientData = {
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    phoneNumber: '', email: '', address: '', preferredLanguage: '',
    nationality: '', emergencyContact: { name: '', relationship: '' },
    status: 'idle', lastUpdated: Date.now(),
};

const mapDBToState = (db: any): PatientData => ({
    id: db.id,
    firstName: db.first_name || '',
    middleName: db.middle_name || '',
    lastName: db.last_name || '',
    dateOfBirth: db.date_of_birth || '',
    gender: db.gender || '',
    phoneNumber: db.phone_number || '',
    email: db.email || '',
    address: db.address || '',
    preferredLanguage: db.preferred_language || '',
    nationality: db.nationality || '',
    emergencyContact: {
        name: db.emergency_contact_name || '',
        relationship: db.emergency_contact_relationship || '',
    },
    religion: db.religion || '',
    status: db.status || 'idle',
    lastUpdated: new Date(db.updated_at).getTime(),
});

const mapStateToDB = (data: PatientData) => ({
    first_name: data.firstName,
    middle_name: data.middleName || null,
    last_name: data.lastName,
    date_of_birth: data.dateOfBirth || null,
    gender: data.gender,
    phone_number: data.phoneNumber,
    email: data.email,
    address: data.address,
    preferred_language: data.preferredLanguage,
    nationality: data.nationality,
    emergency_contact_name: data.emergencyContact.name,
    emergency_contact_relationship: data.emergencyContact.relationship,
    religion: data.religion,
    status: data.status,
    updated_at: new Date().toISOString(),
});

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
    const [patientData, setPatientData] = useState<PatientData>(INITIAL_STATE);
    const activeId = useRef<string | null>(null);
    const dataRef = useRef<PatientData>(patientData);
    const timer = useRef<NodeJS.Timeout | null>(null);

    const isStaff = usePathname()?.includes('/staff');

    // --- Database Operations ---
    const syncWithDB = useCallback(async () => {
        const payload = mapStateToDB(dataRef.current);
        if (activeId.current) {
            await supabase.from('patients').update(payload).eq('id', activeId.current);
        } else {
            const { data } = await supabase.from('patients').insert([payload]).select().single();
            if (data) activeId.current = data.id;
        }
    }, []);

    const debouncedSync = useCallback(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(syncWithDB, 1500);
    }, [syncWithDB]);

    // --- Real-time Subscription (Staff only) ---
    useEffect(() => {
        if (!isStaff) return;

        const loadAndListen = async () => {
            const { data } = await supabase.from('patients').select('*').order('updated_at', { ascending: false }).limit(1).single();
            if (data) setPatientData(mapDBToState(data));

            const channel = supabase.channel(`staff-sync-${Date.now()}`)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' },
                    (p) => p.new && setPatientData(mapDBToState(p.new)))
                .subscribe()

            return () => { supabase.removeChannel(channel); };
        };
        loadAndListen();
    }, [isStaff]);

    // --- Handlers ---
    const updateField = useCallback(<K extends keyof PatientData>(field: K, value: PatientData[K]) => {
        setPatientData(prev => {
            const next = { ...prev, [field]: value, status: prev.status === 'idle' ? 'filling' : prev.status, lastUpdated: Date.now() };
            dataRef.current = next;
            debouncedSync();
            return next;
        });
    }, [debouncedSync]);

    const updateEmergencyContact = useCallback((field: keyof PatientData['emergencyContact'], value: string) => {
        setPatientData(prev => {
            const next = { ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value }, status: prev.status === 'idle' ? 'filling' : prev.status, lastUpdated: Date.now() };
            dataRef.current = next;
            debouncedSync();
            return next;
        });
    }, [debouncedSync]);

    const setStatus = useCallback((status: PatientData['status']) => {
        setPatientData(prev => {
            const next = { ...prev, status, lastUpdated: Date.now() };
            dataRef.current = next;
            syncWithDB(); // Submit ทันทีไม่ต้องรอ debounce
            return next;
        });
    }, [syncWithDB]);

    const resetForm = useCallback(() => {
        activeId.current = null;
        setPatientData(INITIAL_STATE);
    }, []);

    const value = useMemo(() => ({
        patientData, updateField, updateEmergencyContact, setStatus, resetForm
    }), [patientData, updateField, updateEmergencyContact, setStatus, resetForm]);

    return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export const usePatient = () => {
    const ctx = useContext(PatientContext);
    if (!ctx) throw new Error('usePatient must be used within PatientProvider');
    return ctx;
};