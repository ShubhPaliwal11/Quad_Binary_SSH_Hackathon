import { create } from 'zustand';

export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    phone: string;
    shift: 'Morning' | 'Afternoon' | 'Night' | 'Off';
    assignedCase: string | null;
    status: 'Available' | 'In Surgery' | 'On Break' | 'Off Duty';
}

export interface StaffState {
    doctors: Doctor[];
    addDoctor: (name: string, specialization: string, phone: string, shift: Doctor['shift']) => void;
    updateDoctor: (id: string, updates: Partial<Doctor>) => void;
    removeDoctor: (id: string) => void;
    assignDoctorToCase: (doctorId: string, caseId: string) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
    doctors: [
        { id: 'DR-001', name: 'Dr. Ananya Mehta', specialization: 'Cardiology', phone: '9876001001', shift: 'Morning', assignedCase: 'PT-10023', status: 'Available' },
        { id: 'DR-002', name: 'Dr. Vikram Patel', specialization: 'Neurology', phone: '9876002002', shift: 'Morning', assignedCase: 'PT-10024', status: 'In Surgery' },
        { id: 'DR-003', name: 'Dr. Priya Nair', specialization: 'Orthopedics', phone: '9876003003', shift: 'Afternoon', assignedCase: null, status: 'Available' },
        { id: 'DR-004', name: 'Dr. Rahul Gupta', specialization: 'Emergency Medicine', phone: '9876004004', shift: 'Night', assignedCase: 'PT-10025', status: 'Available' },
        { id: 'DR-005', name: 'Dr. Sneha Reddy', specialization: 'Pediatrics', phone: '9876005005', shift: 'Morning', assignedCase: null, status: 'On Break' },
        { id: 'DR-006', name: 'Dr. Amit Sharma', specialization: 'General Surgery', phone: '9876006006', shift: 'Afternoon', assignedCase: null, status: 'Available' },
        { id: 'DR-007', name: 'Dr. Fatima Khan', specialization: 'Oncology', phone: '9876007007', shift: 'Night', assignedCase: null, status: 'Off Duty' },
        { id: 'DR-008', name: 'Dr. Suresh Iyer', specialization: 'Radiology', phone: '9876008008', shift: 'Off', assignedCase: null, status: 'Off Duty' },
    ],

    addDoctor: (name, specialization, phone, shift) => set((state) => ({
        doctors: [...state.doctors, {
            id: 'DR-' + String(state.doctors.length + 1).padStart(3, '0'),
            name, specialization, phone, shift,
            assignedCase: null, status: 'Available'
        }]
    })),

    updateDoctor: (id, updates) => set((state) => ({
        doctors: state.doctors.map(d => d.id === id ? { ...d, ...updates } : d)
    })),

    removeDoctor: (id) => set((state) => ({
        doctors: state.doctors.filter(d => d.id !== id)
    })),

    assignDoctorToCase: (doctorId, caseId) => set((state) => ({
        doctors: state.doctors.map(d => d.id === doctorId ? { ...d, assignedCase: caseId } : d)
    })),
}));
