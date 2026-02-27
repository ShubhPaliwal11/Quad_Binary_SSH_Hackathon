import { create } from 'zustand';

export type AmbulanceStatus = 'En Route' | 'At Pickup' | 'To Hospital' | 'Completed';

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
}

export interface Vitals {
    bp: string;
    heartRate: number;
    temp: number;
    spO2: number;
}

export interface MedicalHistory {
    allergies: string[];
    chronic: string[];
    pastVisits: { date: string; reason: string }[];
    bloodGroup: string;
    medications: Medication[];
    vitals: Vitals;
    previousSurgeries: string[];
    reports: string[];
}

export interface Ambulance {
    id: string;
    driverName: string;
    driverPhone: string;
    patientName: string;
    patientAge: number;
    patientCondition: string;
    guardianName: string;
    guardianPhone: string;
    medicalHistory: MedicalHistory;
    status: AmbulanceStatus;
    eta: number;
    speed: number;
    location: [number, number];
    routeCoordinates: [number, number][];
    routeIndex: number;
}

export interface BedPatientInfo {
    id: string;
    patientId: string;
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    ward: string;
    status: 'Stable' | 'Critical' | 'Improving' | 'Guarded';
    admittedDate: string;
    totalBill: number;
    isAyushmanBharat: boolean;
    history: MedicalHistory;
}

export interface BedStats {
    total: number;
    occupied: number;
}

export interface IncomingRequest {
    id: string;
    pickupLocation: string;
    distance: string;
    eta: string;
    patientName: string;
    contactNumber: string;
    timestamp: number;
}

export interface HospitalState {
    ambulances: Ambulance[];
    selectedAmbulanceId: string | null;
    hospitalLocation: [number, number] | null;
    beds: {
        icu: BedStats;
        ventilator: BedStats;
        emergency: BedStats;
        pediatric: BedStats;
        isolation: BedStats;
    };
    bedPatients: BedPatientInfo[];
    crisisLevel: 'Normal' | 'Elevated' | 'Critical';
    incomingRequests: IncomingRequest[];

    // Actions
    initializeHospitalLocation: (lat: number, lng: number) => void;
    fetchRoutesForAmbulances: () => Promise<void>;
    selectAmbulance: (id: string | null) => void;
    updateAmbulanceLocations: () => void;
    triggerCrisis: (level: 'Normal' | 'Elevated' | 'Critical') => void;
    addEmergencyCase: (patientName: string, age: number, condition: string, guardianName: string, guardianPhone: string) => void;
    updateBedOccupancy: (ward: string, occupied: number) => void;
    addIncomingRequest: (req: IncomingRequest) => void;
    dismissIncomingRequest: (id: string) => void;
}

// Procedural generation based on hospital center
const generateMockAmbulances = (centerLng: number, centerLat: number): Ambulance[] => {
    const rs = (min: number, max: number) => Math.random() * (max - min) + min;
    const randomSpeed = () => Math.floor(rs(8, 15)); // Realistic city-traffic speed 8-15 km/h

    return [
        {
            id: 'MH-12-AB-1234', driverName: 'Rajesh Verma', driverPhone: '9876543210',
            patientName: 'Priya Sharma', patientAge: 32, patientCondition: 'Cardiac distress',
            guardianName: 'Rahul Sharma', guardianPhone: '9876500001',
            medicalHistory: {
                bloodGroup: 'O+',
                allergies: ['Penicillin', 'Dust'],
                chronic: ['Hypertension'],
                pastVisits: [{ date: '2025-08-12', reason: 'Routine checkup' }],
                medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' }, { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' }],
                vitals: { bp: '150/95', heartRate: 110, temp: 98.6, spO2: 96 },
                previousSurgeries: ['Appendectomy (2018)'],
                reports: ['ECG - ST Elevation detected', 'Blood Panel - Elevated Trop T']
            },
            status: 'En Route', eta: 12, speed: randomSpeed(),
            location: [centerLng + rs(0.03, 0.05), centerLat + rs(0.03, 0.05)], routeCoordinates: [], routeIndex: 0
        },
        {
            id: 'DL-1C-XY-9876', driverName: 'Imran Khan', driverPhone: '9823456712',
            patientName: 'Abdul Rahman', patientAge: 58, patientCondition: 'Stroke',
            guardianName: 'Fatima Rahman', guardianPhone: '9823400002',
            medicalHistory: {
                bloodGroup: 'B-',
                allergies: ['None'],
                chronic: ['Type 2 Diabetes', 'High Cholesterol'],
                pastVisits: [{ date: '2025-11-05', reason: 'Dizziness' }, { date: '2024-02-14', reason: 'Endocrinology follow-up' }],
                medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }, { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' }],
                vitals: { bp: '165/100', heartRate: 88, temp: 98.4, spO2: 95 },
                previousSurgeries: [],
                reports: ['MRI Brain - Left MCA Infarct', 'HbA1c - 8.2%']
            },
            status: 'To Hospital', eta: 5, speed: randomSpeed(),
            location: [centerLng + rs(-0.06, -0.04), centerLat + rs(0.04, 0.06)], routeCoordinates: [], routeIndex: 0
        },
        {
            id: 'KA-01-MM-4455', driverName: 'Sandeep Patil', driverPhone: '9898765432',
            patientName: 'Kavita Iyer', patientAge: 41, patientCondition: 'Accident trauma',
            guardianName: 'Suresh Iyer', guardianPhone: '9898700003',
            medicalHistory: {
                bloodGroup: 'AB+',
                allergies: ['Sulfa drugs'],
                chronic: ['Asthma'],
                pastVisits: [],
                medications: [{ name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As needed' }],
                vitals: { bp: '90/60', heartRate: 125, temp: 98.0, spO2: 92 },
                previousSurgeries: ['C-Section (2015)'],
                reports: ['FAST Scan - Positive in Morrison pouch', 'X-Ray Right Femur - Oblique Fracture']
            },
            status: 'At Pickup', eta: 0, speed: 0,
            location: [centerLng + rs(0.05, 0.07), centerLat + rs(-0.05, -0.03)], routeCoordinates: [], routeIndex: 0
        },
        {
            id: 'TN-09-PQ-1122', driverName: 'Arvind Nair', driverPhone: '9812345678',
            patientName: 'Rohit Singh', patientAge: 27, patientCondition: 'Internal bleeding',
            guardianName: 'Neha Singh', guardianPhone: '9812300004',
            medicalHistory: {
                bloodGroup: 'A+',
                allergies: ['Latex'],
                chronic: ['None'],
                pastVisits: [{ date: '2026-01-10', reason: 'Sports injury' }],
                medications: [],
                vitals: { bp: '85/55', heartRate: 130, temp: 97.8, spO2: 94 },
                previousSurgeries: ['ACL Repair (2020)'],
                reports: ['CT Abdomen - Splenic Laceration']
            },
            status: 'To Hospital', eta: 18, speed: randomSpeed(),
            location: [centerLng + rs(-0.07, -0.05), centerLat + rs(-0.06, -0.04)], routeCoordinates: [], routeIndex: 0
        },
        {
            id: 'UP-16-ZT-5566', driverName: 'Manish Tiwari', driverPhone: '9834567123',
            patientName: 'Meena Joshi', patientAge: 65, patientCondition: 'Hypertension collapse',
            guardianName: 'Amit Joshi', guardianPhone: '9834500005',
            medicalHistory: {
                bloodGroup: 'O-',
                allergies: ['Peanuts', 'Ibuprofen'],
                chronic: ['Severe Hypertension', 'Osteoarthritis'],
                pastVisits: [{ date: '2026-02-01', reason: 'BP Monitoring' }, { date: '2025-10-20', reason: 'Chest pain' }],
                medications: [{ name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily' }, { name: 'Chlorthalidone', dosage: '12.5mg', frequency: 'Once daily' }, { name: 'Paracetamol', dosage: '500mg', frequency: 'As needed for joint pain' }],
                vitals: { bp: '190/110', heartRate: 95, temp: 98.5, spO2: 97 },
                previousSurgeries: ['Right Knee Replacement (2022)'],
                reports: ['ECHO - Left Ventricular Hypertrophy', 'Renal Doppler - Normal']
            },
            status: 'En Route', eta: 22, speed: randomSpeed(),
            location: [centerLng + rs(-0.03, -0.01), centerLat + rs(0.06, 0.08)], routeCoordinates: [], routeIndex: 0
        },
    ];
};

const generateMockBedPatients = (beds: HospitalState['beds']): BedPatientInfo[] => {
    const patients: BedPatientInfo[] = [];
    const names = [
        'Priya Sharma', 'Rohit Kumar', 'Meena Joshi', 'Abdul Rahman', 'Kavita Iyer',
        'Amit Das', 'Neha Patel', 'Suresh Murthy', 'Vikram Singh', 'Ananya Reddy',
        'Sanjay Gupta', 'Deepika Padukone', 'Rajesh Khanna', 'Sunita Williams', 'Arjun Kapoor',
        'Priyanka Chopra', 'Ranbir Kapoor', 'Aishwarya Rai', 'Shah Rukh Khan', 'Salman Khan'
    ];
    const statuses: ('Stable' | 'Critical' | 'Improving' | 'Guarded')[] = ['Stable', 'Critical', 'Improving', 'Guarded'];
    const wards = Object.keys(beds);

    wards.forEach(ward => {
        const count = beds[ward as keyof typeof beds].occupied;
        for (let i = 0; i < count; i++) {
            const id = `${ward.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
            const name = names[i % names.length];
            patients.push({
                id,
                patientId: `PT-${10000 + patients.length}`,
                name,
                age: 25 + (i * 7) % 50,
                gender: i % 2 === 0 ? 'F' : 'M',
                bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][i % 5],
                ward: ward.toUpperCase(),
                status: statuses[i % 4],
                admittedDate: '20 Feb 2026',
                totalBill: 45000 + (i * 12500),
                isAyushmanBharat: Math.random() > 0.5,
                history: {
                    bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][i % 5],
                    allergies: i % 3 === 0 ? ['Latex', 'Dust'] : ['None'],
                    chronic: i % 4 === 0 ? ['Hypertension'] : i % 5 === 0 ? ['Diabetes'] : ['None'],
                    pastVisits: [{ date: '2025-12-10', reason: 'Routine Checkup' }],
                    medications: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'TDS' }],
                    vitals: { bp: '120/80', heartRate: 72 + (i % 20), temp: 98.6, spO2: 95 + (i % 5) },
                    previousSurgeries: i % 6 === 0 ? ['Appendectomy'] : [],
                    reports: ['Blood Panel - Normal']
                }
            });
        }
    });
    return patients;
};

export const useHospitalStore = create<HospitalState>((set) => ({
    ambulances: [], // Starts empty until location is set
    selectedAmbulanceId: null,
    hospitalLocation: null,
    beds: {
        icu: { total: 50, occupied: 42 },
        ventilator: { total: 20, occupied: 18 },
        emergency: { total: 40, occupied: 35 },
        pediatric: { total: 30, occupied: 12 },
        isolation: { total: 15, occupied: 5 },
    },
    bedPatients: [],
    crisisLevel: 'Normal',
    incomingRequests: [],

    initializeHospitalLocation: (lat, lng) => set((state) => {
        // Only initialize once to prevent ambulances jumping around on re-renders
        if (state.hospitalLocation) return {};
        const mockAmbulances = generateMockAmbulances(lng, lat);
        const mockBedPatients = generateMockBedPatients(state.beds);

        console.log("Hospital Store Initialized with", mockBedPatients.length, "patients");

        // Trigger async fetch for real road routes right after initiating state
        setTimeout(() => {
            useHospitalStore.getState().fetchRoutesForAmbulances();
        }, 100);

        return {
            hospitalLocation: [lng, lat],
            ambulances: mockAmbulances,
            bedPatients: mockBedPatients
        };
    }),

    fetchRoutesForAmbulances: async () => {
        const state = useHospitalStore.getState();
        if (!state.hospitalLocation) return;
        const [hLng, hLat] = state.hospitalLocation;

        const updatedAmbulances = await Promise.all(state.ambulances.map(async (amb) => {
            try {
                // Ignore fetching if already fetched or completed.
                if (amb.routeCoordinates.length > 0) return amb;

                const [lng, lat] = amb.location;
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${lng},${lat};${hLng},${hLat}?overview=full&geometries=geojson`);
                const data = await res.json();

                if (data.code === 'Ok' && data.routes && data.routes[0]) {
                    const coords = data.routes[0].geometry.coordinates as [number, number][];
                    const durationMins = (data.routes[0].duration / 60) || amb.eta;
                    // Snap the ambulance instantly to the very first node of the actual road
                    return { ...amb, location: coords[0], routeCoordinates: coords, eta: durationMins };
                }
            } catch (err) {
                console.warn(`Failed to fetch route for ambulance ${amb.id}`, err);
            }
            return amb;
        }));

        set({ ambulances: updatedAmbulances });
    },

    selectAmbulance: (id) => set({ selectedAmbulanceId: id }),

    updateAmbulanceLocations: () => set((state) => {
        if (!state.hospitalLocation || state.ambulances.length === 0) return {};

        const updated = state.ambulances.map(amb => {
            if (amb.status === 'Completed') return amb;

            if (amb.routeCoordinates && amb.routeCoordinates.length > 0) {
                // Logic to smoothly move across nodes
                // Skip if reached end
                if (amb.routeIndex >= amb.routeCoordinates.length - 1) {
                    return { ...amb, status: 'Completed' as AmbulanceStatus, eta: 0 };
                }

                // Advance the marker by 1 node per tick for realistic movement
                // OSRM routes have dense coordinate nodes, so 1 node per 3s tick ≈ walking/slow-drive speed
                const advancePace = Math.max(1, Math.floor(amb.speed / 15));
                const nextIndex = Math.min(amb.routeIndex + advancePace, amb.routeCoordinates.length - 1);

                // Estimate remaining ETA based on nodes left
                const pctRemaining = 1 - (nextIndex / amb.routeCoordinates.length);
                const updatedEta = pctRemaining * amb.eta;

                return {
                    ...amb,
                    routeIndex: nextIndex,
                    location: amb.routeCoordinates[nextIndex],
                    eta: Math.max(0, updatedEta),
                };
            } else {
                // If route hasn't loaded (or failed), keep the ambulance perfectly stationary 
                // DO NOT jitter randomly across the map off-road. Wait for the route to load.
                return amb;
            }
        });
        return { ambulances: updated };
    }),

    triggerCrisis: (level) => set({ crisisLevel: level }),

    addEmergencyCase: (patientName, age, condition, guardianName, guardianPhone) => set((state) => {
        if (!state.hospitalLocation) return {};
        const [hLng, hLat] = state.hospitalLocation;
        const rs = (min: number, max: number) => Math.random() * (max - min) + min;
        const driverNames = ['Vikram Jha', 'Sunil Rao', 'Deepak Kumar', 'Anil Gupta', 'Ramesh Yadav'];
        const plates = ['MP-09-CY-1222', 'RJ-14-AB-5588', 'GJ-01-KK-7799', 'HR-26-MN-3344', 'UP-80-ZZ-6611'];

        const newAmb: Ambulance = {
            id: plates[Math.floor(Math.random() * plates.length)] + '-' + Date.now().toString().slice(-4),
            driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
            driverPhone: '98' + Math.floor(10000000 + Math.random() * 90000000).toString(),
            patientName, patientAge: age, patientCondition: condition,
            guardianName, guardianPhone,
            medicalHistory: {
                bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][Math.floor(Math.random() * 5)],
                allergies: ['None'], chronic: ['None'], pastVisits: [],
                medications: [], vitals: { bp: '120/80', heartRate: 80, temp: 98.6, spO2: 98 },
                previousSurgeries: [], reports: []
            },
            status: 'En Route', eta: 15, speed: Math.floor(rs(8, 15)),
            location: [hLng + rs(-0.03, 0.03), hLat + rs(-0.03, 0.03)],
            routeCoordinates: [], routeIndex: 0
        };

        // Trigger route fetch for the new ambulance after state update
        setTimeout(() => { useHospitalStore.getState().fetchRoutesForAmbulances(); }, 200);

        return { ambulances: [...state.ambulances, newAmb] };
    }),

    updateBedOccupancy: (ward, occupied) => set((state) => {
        const key = ward as keyof typeof state.beds;
        if (!state.beds[key]) return {};

        const currentCount = state.beds[key].occupied;
        const newCount = Math.max(0, Math.min(occupied, state.beds[key].total));

        let newBedPatients = [...state.bedPatients];

        // If count decreased, remove the highest indexed patients for this ward
        if (newCount < currentCount) {
            const wardPrefix = ward.toUpperCase().slice(0, 3);
            for (let i = currentCount; i > newCount; i--) {
                const bedId = `${wardPrefix}-${String(i).padStart(2, '0')}`;
                newBedPatients = newBedPatients.filter(p => p.id !== bedId);
            }
        }

        return {
            beds: {
                ...state.beds,
                [key]: { ...state.beds[key], occupied: newCount }
            },
            bedPatients: newBedPatients
        };
    }),

    addIncomingRequest: (req) => set((state) => ({
        incomingRequests: [...state.incomingRequests, req]
    })),

    dismissIncomingRequest: (id) => set((state) => ({
        incomingRequests: state.incomingRequests.filter(r => r.id !== id)
    })),
}));
