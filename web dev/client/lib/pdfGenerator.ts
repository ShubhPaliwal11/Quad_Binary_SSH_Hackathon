import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Ambulance } from '../stores/useHospitalStore';

export const generatePatientDossierPDF = (originalPatient: Ambulance) => {
    // Hardcoded Aditya Kumrawat Health Resume — always shown in hospital view
    const patient: Ambulance = {
        ...originalPatient,
        patientName: 'Aditya Kumrawat',
        patientAge: 21,
        guardianName: 'Kumrawat Family',
        guardianPhone: '9876543210',
        medicalHistory: {
            bloodGroup: 'B+',
            allergies: ['Dust', 'Pollen'],
            chronic: ['None'],
            pastVisits: [
                { date: '2026-01-15', reason: 'Routine Health Checkup' },
                { date: '2025-08-22', reason: 'Seasonal Allergy Consultation' }
            ],
            medications: [],
            vitals: { bp: '118/76', heartRate: 72, temp: 98.4, spO2: 98 },
            previousSurgeries: [],
            reports: [
                'CBC - All values within normal range',
                'Chest X-Ray - Clear, no abnormalities',
                'Fasting Blood Sugar - 88 mg/dL (Normal)',
                'Lipid Profile - Total Cholesterol 172 mg/dL (Normal)'
            ]
        }
    };
    const doc = new jsPDF();

    // Custom Fonts & Colors Setup
    const primaryColor: [number, number, number] = [13, 138, 188]; // HealthSaarthi Blue
    const secondaryColor: [number, number, number] = [71, 85, 105]; // Slate 600

    // 1. Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('HEALTHSAARTHI', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('HOSPITAL COMMAND - PATIENT DOSSIER', 120, 20);

    // 2. Report Meta Info
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 40);
    doc.text(`Ambulance Unit: ${patient.id}`, 140, 40);

    // 3. Emergency Context (The vital reason they are in the ambulance)
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(14, 45, 182, 25, 3, 3, 'FD');

    doc.setTextColor(220, 38, 38); // red-600
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY DISPATCH REASON', 18, 55);

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(patient.patientCondition, 18, 63);

    let startY = 80;

    // 4. Patient Demographics Profile Layer
    autoTable(doc, {
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
        bodyStyles: { textColor: [71, 85, 105] },
        head: [['Patient Name', 'Age', 'Blood Group', 'Guardian Contact']],
        body: [
            [
                patient.patientName,
                `${patient.patientAge} Yrs`,
                patient.medicalHistory.bloodGroup,
                `${patient.guardianName}\n(+91 ${patient.guardianPhone})`
            ]
        ],
    });

    startY = (doc as any).lastAutoTable.finalY + 15;

    // 5. Current Vitals (En Route)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Live Vitals At Dispatch', 14, startY);

    startY += 5;
    autoTable(doc, {
        startY: startY,
        theme: 'plain',
        headStyles: { fillColor: [255, 255, 255], textColor: [100, 116, 139], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { textColor: [15, 23, 42], fontStyle: 'bold', fontSize: 16 },
        head: [['Blood Pressure', 'Heart Rate', 'Temperature', 'SpO2']],
        body: [
            [
                patient.medicalHistory.vitals.bp,
                `${patient.medicalHistory.vitals.heartRate} BPM`,
                `${patient.medicalHistory.vitals.temp} °F`,
                `${patient.medicalHistory.vitals.spO2}%`
            ]
        ],
    });

    startY = (doc as any).lastAutoTable.finalY + 15;

    // 6. Medical History (Allergies & Chronic)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Known Medical History', 14, startY);

    startY += 5;
    autoTable(doc, {
        startY: startY,
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        body: [
            ['Allergies', patient.medicalHistory.allergies.join(', ') || 'None Recorded'],
            ['Chronic Conditions', patient.medicalHistory.chronic.join(', ') || 'None Recorded'],
            ['Previous Surgeries', patient.medicalHistory.previousSurgeries.join(', ') || 'None Recorded']
        ],
    });

    startY = (doc as any).lastAutoTable.finalY + 15;

    // 7. Active Medications
    if (patient.medicalHistory.medications.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Active Prescriptions', 14, startY);

        startY += 5;
        const medBody = patient.medicalHistory.medications.map(m => [m.name, m.dosage, m.frequency]);
        autoTable(doc, {
            startY: startY,
            theme: 'grid',
            headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] },
            head: [['Medication', 'Dosage', 'Frequency']],
            body: medBody,
        });
        startY = (doc as any).lastAutoTable.finalY + 15;
    }

    // 8. Attached Reports & Past Visits
    if (startY > 250) { doc.addPage(); startY = 20; }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Attached Diagnostic Reports', 14, startY);

    startY += 5;
    const reportBody = patient.medicalHistory.reports.length > 0
        ? patient.medicalHistory.reports.map(r => [r])
        : [['No recent structural/lab reports attached.']];

    autoTable(doc, {
        startY: startY,
        theme: 'plain',
        bodyStyles: { textColor: [71, 85, 105], fontStyle: 'italic' },
        body: reportBody,
    });

    // Provide correct filename
    const fileName = `${patient.patientName.replace(/\s+/g, '_')}_Medical_Dossier.pdf`;

    // 1. Generate Blob with explicit PDF MIME type for Preview
    const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Open preview in a new browser tab
    window.open(blobUrl, '_blank');

    // 2. Trigger the actual correctly named file download
    doc.save(fileName);
};
