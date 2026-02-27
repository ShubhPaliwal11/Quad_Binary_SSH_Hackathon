// Mock data for doctor appointment system

export const MOCK_SPECIALTIES = [
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Dermatology' },
    { id: 3, name: 'Pediatrics' },
    { id: 4, name: 'Orthopedics' },
    { id: 5, name: 'Neurology' },
    { id: 6, name: 'General Practice' },
];

export const MOCK_DOCTORS = [
    {
        id: 1,
        name: 'Dr. Satish Talreja',
        email: 'satish.talreja@hospital.com',
        phone: '+91 98765 43210',
        specialty: 'Cardiology',
        specialtyId: 1,
    },
    {
        id: 2,
        name: 'Dr. Abhina',
        email: 'michael.chen@hospital.com',
        phone: '+91 98765 43211',
        specialty: 'Dermatology',
        specialtyId: 2,
    },
    {
        id: 3,
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.com',
        phone: '+91 98765 43212',
        specialty: 'Pediatrics',
        specialtyId: 3,
    },
];

export const MOCK_PATIENTS = [
    {
        id: 1,
        name: 'Aditya Kumrawat',
        email: 'aditya@example.com',
        phone: '+91 70000 00001',
        address: 'Indore, Madhya Pradesh',
        dob: '1995-05-15',
    },
    {
        id: 2,
        name: 'Ravi Patel',
        email: 'ravi@example.com',
        phone: '+91 70000 00002',
        address: 'Mumbai, Maharashtra',
        dob: '1988-08-22',
    },
    {
        id: 3,
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 70000 00003',
        address: 'Hyderabad, Telangana',
        dob: '1992-03-10',
    },
];

export const MOCK_SCHEDULES = [
    {
        id: 1,
        doctorId: 1,
        doctorName: 'Dr. Satish Talreja',
        title: 'Morning Consultation',
        date: '2025-11-25',
        time: '09:00',
        maxPatients: 10,
        bookedPatients: 7,
    },
    {
        id: 2,
        doctorId: 1,
        doctorName: 'Dr. Abhinav Mishra',
        title: 'Evening Consultation',
        date: '2025-11-25',
        time: '16:00',
        maxPatients: 8,
        bookedPatients: 5,
    },
    {
        id: 3,
        doctorId: 2,
        doctorName: 'Dr. Prashant Geete',
        title: 'Skin Checkup Session',
        date: '2025-11-26',
        time: '10:00',
        maxPatients: 12,
        bookedPatients: 9,
    },
];

export const MOCK_APPOINTMENTS = [
    {
        id: 1,
        patientId: 1,
        patientName: 'Aditya Kumrawat',
        doctorId: 1,
        doctorName: 'Dr. Satish Talreja',
        scheduleId: 1,
        scheduleTitle: 'Morning Consultation',
        date: '2025-11-25',
        time: '09:00',
        queueNumber: 3,
        status: 'confirmed',
    },
    {
        id: 2,
        patientId: 2,
        patientName: 'Ravi Patel',
        doctorId: 1,
        doctorName: 'Dr. Abhinav Mishra ',
        scheduleId: 2,
        scheduleTitle: 'Evening Consultation',
        date: '2025-11-25',
        time: '16:00',
        queueNumber: 1,
        status: 'confirmed',
    },
    {
        id: 3,
        patientId: 3,
        patientName: 'Sneha Reddy',
        doctorId: 2,
        doctorName: 'Dr. Prashant Geete',
        scheduleId: 3,
        scheduleTitle: 'Skin Checkup Session',
        date: '2025-11-26',
        time: '10:00',
        queueNumber: 5,
        status: 'pending',
    },
];

// Current logged-in doctor (for doctor dashboard)
export const CURRENT_DOCTOR = MOCK_DOCTORS[0]; // Dr. Sarah Johnson

// Mock data for past consultations
export const MOCK_PAST_CONSULTATIONS = [
    {
        id: 1,
        date: '2026-02-15',
        time: '10:30 AM',
        doctorName: 'Dr. Satish Talreja',
        specialty: 'Cardiology',
        consultationType: 'Video Call',
        diagnosis: 'Routine Heart Checkup',
        prescription: 'Aspirin 75mg daily, Blood pressure monitoring',
        symptoms: 'Chest discomfort, fatigue',
        followUpDate: '2026-03-15',
        status: 'completed',
        rating: 5,
        cost: '₹800',
        hospital: 'Apollo Hospital, Indore',
        medicines: [
            { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' },
            { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '30 days' },
            { name: 'Ramipril', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }
        ]
    },
    {
        id: 2,
        date: '2026-01-20',
        time: '02:00 PM',
        doctorName: 'Dr. Prashant Geete',
        specialty: 'Dermatology',
        consultationType: 'In-Person',
        diagnosis: 'Allergic Dermatitis',
        prescription: 'Hydrocortisone cream, Antihistamines',
        symptoms: 'Skin rash, itching',
        followUpDate: '2026-02-20',
        status: 'completed',
        rating: 4,
        cost: '₹650',
        hospital: 'Fortis Hospital, Mumbai',
        medicines: [
            { name: 'Hydrocortisone Cream', dosage: '1%', frequency: 'Apply twice daily', duration: '14 days' },
            { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '10 days' },
            { name: 'Calamine Lotion', dosage: 'Topical', frequency: 'As needed', duration: '14 days' }
        ]
    },
    {
        id: 3,
        date: '2025-12-10',
        time: '11:00 AM',
        doctorName: 'Dr. Priya Sharma',
        specialty: 'Pediatrics',
        consultationType: 'Video Call',
        diagnosis: 'Common Cold & Fever',
        prescription: 'Paracetamol syrup, Rest and fluids',
        symptoms: 'Fever, cough, runny nose',
        followUpDate: null,
        status: 'completed',
        rating: 5,
        cost: '₹500',
        hospital: 'Max Hospital, Delhi',
        medicines: [
            { name: 'Paracetamol Syrup', dosage: '250mg/5ml', frequency: 'Every 6 hours if fever', duration: '5 days' },
            { name: 'Cetirizine Syrup', dosage: '5ml', frequency: 'Once daily', duration: '5 days' }
        ]
    },
    {
        id: 4,
        date: '2025-11-05',
        time: '04:30 PM',
        doctorName: 'Dr. Rajesh Kumar',
        specialty: 'Orthopedics',
        consultationType: 'In-Person',
        diagnosis: 'Knee Pain - Mild Arthritis',
        prescription: 'Ibuprofen, Physiotherapy sessions',
        symptoms: 'Knee pain, stiffness',
        followUpDate: '2025-12-05',
        status: 'completed',
        rating: 4,
        cost: '₹1200',
        hospital: 'Fortis Hospital, Indore',
        medicines: [
            { name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily after meals', duration: '15 days' },
            { name: 'Calcium Carbonate', dosage: '500mg', frequency: 'Once daily', duration: '30 days' },
            { name: 'Vitamin D3', dosage: '60000 IU', frequency: 'Once weekly', duration: '8 weeks' },
            { name: 'Diclofenac Gel', dosage: 'Topical', frequency: 'Apply twice daily', duration: '15 days' }
        ]
    },
    {
        id: 5,
        date: '2025-10-18',
        time: '09:00 AM',
        doctorName: 'Dr. Anjali Mehta',
        specialty: 'General Physician',
        consultationType: 'Video Call',
        diagnosis: 'Seasonal Flu',
        prescription: 'Antibiotics, Vitamin C supplements',
        symptoms: 'Body ache, headache, fatigue',
        followUpDate: null,
        status: 'completed',
        rating: 5,
        cost: '₹400',
        hospital: 'CARE Hospital, Hyderabad',
        medicines: [
            { name: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', duration: '5 days' },
            { name: 'Vitamin C', dosage: '500mg', frequency: 'Twice daily', duration: '15 days' },
            { name: 'Paracetamol', dosage: '650mg', frequency: 'Every 8 hours if needed', duration: '5 days' }
        ]
    },
    {
        id: 6,
        date: '2025-09-22',
        time: '03:15 PM',
        doctorName: 'Dr. Satish Talreja',
        specialty: 'Cardiology',
        consultationType: 'In-Person',
        diagnosis: 'Hypertension Monitoring',
        prescription: 'Atenolol 50mg, Low sodium diet',
        symptoms: 'High blood pressure',
        followUpDate: '2026-02-15',
        status: 'completed',
        rating: 5,
        cost: '₹900',
        hospital: 'Apollo Hospital, Indore',
        medicines: [
            { name: 'Atenolol', dosage: '50mg', frequency: 'Once daily in morning', duration: '30 days' },
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
            { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily', duration: '30 days' }
        ]
    },
];
