import {
  Patient,
  Doctor,
  PatientFilters,
  PatientStatus,
  NorwoodScale,
  RiskIndicator,
} from './types';

// ============================================================================
// Mock Data Store Class
// ============================================================================

class MockDataStore {
  private patients: Map<string, Patient>;
  private doctors: Map<string, Doctor>;
  private storageKey = 'hair-restoration-mock-data';
  private doctorsStorageKey = 'hair-restoration-doctors';

  constructor() {
    this.patients = new Map();
    this.doctors = new Map();
    this.loadFromLocalStorage();
    
    // Initialize sample data if empty
    if (this.patients.size === 0) {
      this.initializeSampleData();
    }
  }

  // ============================================================================
  // Patient CRUD Operations
  // ============================================================================

  createPatient(patient: Omit<Patient, 'id'>): Patient {
    const id = this.generateId();
    const newPatient: Patient = {
      ...patient,
      id,
    };
    
    this.patients.set(id, newPatient);
    this.saveToLocalStorage();
    
    return newPatient;
  }

  getPatient(id: string): Patient | undefined {
    return this.patients.get(id);
  }

  getAllPatients(): Patient[] {
    return Array.from(this.patients.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | undefined {
    const patient = this.patients.get(id);
    
    if (!patient) {
      return undefined;
    }

    const updatedPatient: Patient = {
      ...patient,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.patients.set(id, updatedPatient);
    this.saveToLocalStorage();
    
    return updatedPatient;
  }

  // ============================================================================
  // Doctor CRUD Operations
  // ============================================================================

  getDoctor(id: string): Doctor | undefined {
    return this.doctors.get(id);
  }

  getAllDoctors(): Doctor[] {
    return Array.from(this.doctors.values());
  }

  // ============================================================================
  // Search and Filter Operations
  // ============================================================================

  searchPatients(query: string): Patient[] {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      return this.getAllPatients();
    }

    return this.getAllPatients().filter(patient => {
      const fullName = `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`.toLowerCase();
      const email = patient.personalInfo.email.toLowerCase();
      const phone = patient.personalInfo.phone.toLowerCase();
      
      return (
        fullName.includes(lowerQuery) ||
        email.includes(lowerQuery) ||
        phone.includes(lowerQuery)
      );
    });
  }

  filterPatients(filters: PatientFilters): Patient[] {
    let results = this.getAllPatients();

    // Apply search query filter
    if (filters.searchQuery) {
      results = this.searchPatients(filters.searchQuery);
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      results = results.filter(p => filters.status!.includes(p.status));
    }

    // Apply Norwood scale filter
    if (filters.norwoodScale && filters.norwoodScale.length > 0) {
      results = results.filter(p => 
        p.norwoodScale && filters.norwoodScale!.includes(p.norwoodScale)
      );
    }

    // Apply AI score range filter
    if (filters.aiScoreRange) {
      const { min, max } = filters.aiScoreRange;
      results = results.filter(p => 
        p.aiQualificationScore >= min && p.aiQualificationScore <= max
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      results = results.filter(p => {
        const submittedDate = new Date(p.submittedAt);
        return submittedDate >= start && submittedDate <= end;
      });
    }

    // Apply assigned doctor filter
    if (filters.assignedDoctorId) {
      results = results.filter(p => p.assignedDoctorId === filters.assignedDoctorId);
    }

    return results;
  }

  // ============================================================================
  // LocalStorage Persistence
  // ============================================================================

  saveToLocalStorage(): void {
    // Skip if running on server-side
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const patientsData = Array.from(this.patients.values());
      const doctorsData = Array.from(this.doctors.values());
      
      // Convert dates to ISO strings for storage
      const serializedPatients = patientsData.map(patient => ({
        ...patient,
        submittedAt: patient.submittedAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
        timeline: patient.timeline.map(event => ({
          ...event,
          timestamp: event.timestamp.toISOString(),
        })),
        staffNotes: patient.staffNotes.map(note => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
        })),
        doctorNotes: patient.doctorNotes.map(note => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
        })),
        appointments: patient.appointments.map(apt => ({
          ...apt,
          date: apt.date.toISOString(),
        })),
        messages: patient.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        photos: patient.photos ? {
          front: patient.photos.front ? { ...patient.photos.front, uploadedAt: patient.photos.front.uploadedAt.toISOString() } : undefined,
          top: patient.photos.top ? { ...patient.photos.top, uploadedAt: patient.photos.top.uploadedAt.toISOString() } : undefined,
          back: patient.photos.back ? { ...patient.photos.back, uploadedAt: patient.photos.back.uploadedAt.toISOString() } : undefined,
          left: patient.photos.left ? { ...patient.photos.left, uploadedAt: patient.photos.left.uploadedAt.toISOString() } : undefined,
          right: patient.photos.right ? { ...patient.photos.right, uploadedAt: patient.photos.right.uploadedAt.toISOString() } : undefined,
          closeup: patient.photos.closeup ? { ...patient.photos.closeup, uploadedAt: patient.photos.closeup.uploadedAt.toISOString() } : undefined,
        } : {},
      }));

      localStorage.setItem(this.storageKey, JSON.stringify(serializedPatients));
      localStorage.setItem(this.doctorsStorageKey, JSON.stringify(doctorsData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage(): void {
    // Skip if running on server-side
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const patientsData = localStorage.getItem(this.storageKey);
      const doctorsData = localStorage.getItem(this.doctorsStorageKey);

      if (patientsData) {
        const parsed = JSON.parse(patientsData);
        
        // Convert ISO strings back to Date objects
        const patients = parsed.map((patient: any) => ({
          ...patient,
          submittedAt: new Date(patient.submittedAt),
          updatedAt: new Date(patient.updatedAt),
          timeline: patient.timeline.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp),
          })),
          staffNotes: patient.staffNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
          })),
          doctorNotes: patient.doctorNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
          })),
          appointments: patient.appointments.map((apt: any) => ({
            ...apt,
            date: new Date(apt.date),
          })),
          messages: patient.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          photos: patient.photos ? {
            front: patient.photos.front ? { ...patient.photos.front, uploadedAt: new Date(patient.photos.front.uploadedAt) } : undefined,
            top: patient.photos.top ? { ...patient.photos.top, uploadedAt: new Date(patient.photos.top.uploadedAt) } : undefined,
            back: patient.photos.back ? { ...patient.photos.back, uploadedAt: new Date(patient.photos.back.uploadedAt) } : undefined,
            left: patient.photos.left ? { ...patient.photos.left, uploadedAt: new Date(patient.photos.left.uploadedAt) } : undefined,
            right: patient.photos.right ? { ...patient.photos.right, uploadedAt: new Date(patient.photos.right.uploadedAt) } : undefined,
            closeup: patient.photos.closeup ? { ...patient.photos.closeup, uploadedAt: new Date(patient.photos.closeup.uploadedAt) } : undefined,
          } : {},
        }));

        patients.forEach((patient: Patient) => {
          this.patients.set(patient.id, patient);
        });
      }

      if (doctorsData) {
        const doctors = JSON.parse(doctorsData);
        doctors.forEach((doctor: Doctor) => {
          this.doctors.set(doctor.id, doctor);
        });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // Sample Data Initialization
  // ============================================================================

  initializeSampleData(): void {
    // Initialize Doctors
    const drSarahKim: Doctor = {
      id: 'doc-1',
      name: 'Dr. Sarah Kim',
      specialty: 'Hair Restoration Surgery',
      email: 'sarah.kim@vellumhair.com',
      phone: '(555) 123-4567',
      assignedPatientIds: [],
    };

    const drMichaelChen: Doctor = {
      id: 'doc-2',
      name: 'Dr. Michael Chen',
      specialty: 'FUE Specialist',
      email: 'michael.chen@vellumhair.com',
      phone: '(555) 123-4568',
      assignedPatientIds: [],
    };

    this.doctors.set(drSarahKim.id, drSarahKim);
    this.doctors.set(drMichaelChen.id, drMichaelChen);

    // Initialize 7 Sample Patients
    const baseDate = new Date('2026-06-01');
    
    this.createSamplePatient({
      firstName: 'Ahmed',
      lastName: 'Raza',
      age: 34,
      email: 'ahmed.raza@email.com',
      phone: '(555) 234-5678',
      norwoodScale: '4',
      aiScore: 88,
      status: 'Qualified',
      doctorId: drSarahKim.id,
      riskIndicators: [],
      submittedDaysAgo: 15,
    });

    this.createSamplePatient({
      firstName: 'James',
      lastName: 'Whitfield',
      age: 41,
      email: 'james.whitfield@email.com',
      phone: '(555) 345-6789',
      norwoodScale: '5',
      aiScore: 76,
      status: 'Under Review',
      doctorId: drSarahKim.id,
      riskIndicators: [{
        id: 'risk-1',
        category: 'medical-history',
        severity: 'high',
        description: 'Currently on blood thinners — flag for pre-op review',
      }],
      submittedDaysAgo: 10,
    });

    this.createSamplePatient({
      firstName: 'Omar',
      lastName: 'Siddiqui',
      age: 29,
      email: 'omar.siddiqui@email.com',
      phone: '(555) 456-7890',
      norwoodScale: '3V',
      aiScore: 92,
      status: 'Booked',
      doctorId: drMichaelChen.id,
      riskIndicators: [],
      submittedDaysAgo: 20,
      hasAppointment: true,
    });

    this.createSamplePatient({
      firstName: 'Daniel',
      lastName: 'Cruz',
      age: 52,
      email: 'daniel.cruz@email.com',
      phone: '(555) 567-8901',
      norwoodScale: '6',
      aiScore: 54,
      status: 'Submitted',
      riskIndicators: [{
        id: 'risk-2',
        category: 'unrealistic-expectations',
        severity: 'medium',
        description: 'Unrealistic density expectations for advanced hair loss stage',
      }],
      submittedDaysAgo: 5,
    });

    this.createSamplePatient({
      firstName: 'Bilal',
      lastName: 'Ahmed',
      age: 26,
      email: 'bilal.ahmed@email.com',
      phone: '(555) 678-9012',
      norwoodScale: '2',
      aiScore: 81,
      status: 'Qualified',
      doctorId: drMichaelChen.id,
      riskIndicators: [],
      submittedDaysAgo: 12,
    });

    this.createSamplePatient({
      firstName: 'Robert',
      lastName: 'Nunez',
      age: 45,
      email: 'robert.nunez@email.com',
      phone: '(555) 789-0123',
      norwoodScale: '7',
      aiScore: 38,
      status: 'Rejected',
      riskIndicators: [
        {
          id: 'risk-3',
          category: 'medical-history',
          severity: 'high',
          description: 'Limited donor area for desired density',
        },
        {
          id: 'risk-4',
          category: 'budget-constraints',
          severity: 'medium',
          description: 'Budget may be insufficient for desired outcome',
        },
      ],
      submittedDaysAgo: 8,
    });

    this.createSamplePatient({
      firstName: 'Hassan',
      lastName: 'Tariq',
      age: 31,
      email: 'hassan.tariq@email.com',
      phone: '(555) 890-1234',
      norwoodScale: '3',
      aiScore: 85,
      status: 'Booked',
      doctorId: drSarahKim.id,
      riskIndicators: [],
      submittedDaysAgo: 18,
      hasAppointment: true,
    });

    this.saveToLocalStorage();
  }

  private createSamplePatient(params: {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    phone: string;
    norwoodScale: NorwoodScale;
    aiScore: number;
    status: PatientStatus;
    doctorId?: string;
    riskIndicators: RiskIndicator[];
    submittedDaysAgo: number;
    hasAppointment?: boolean;
  }): void {
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - params.submittedDaysAgo);

    const patient: Patient = {
      id: this.generateId(),
      personalInfo: {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        dateOfBirth: new Date(new Date().getFullYear() - params.age, 0, 1).toISOString().split('T')[0],
        age: params.age,
        gender: 'male',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
      },
      hairLossHistory: {
        ageWhenStarted: params.age - 5,
        familyHistory: true,
        progressionRate: 'moderate',
        affectedAreas: ['crown', 'temples'],
        medicalConditions: params.riskIndicators.some(r => r.category === 'medical-history') 
          ? ['Hypertension'] 
          : [],
        medications: params.riskIndicators.some(r => r.category === 'medical-history') 
          ? ['Blood thinners'] 
          : [],
      },
      currentTreatments: {
        usingMinoxidil: true,
        usingFinasteride: params.age > 25,
        usingOtherMedications: [],
        duration: '2 years',
        effectiveness: 'somewhat-effective',
      },
      previousTransplants: {
        hadPreviousTransplant: false,
      },
      norwoodScale: params.norwoodScale,
      photos: {
        front: {
          url: '/placeholder-photo.jpg',
          uploadedAt: submittedAt,
          size: 102400,
        },
        top: {
          url: '/placeholder-photo.jpg',
          uploadedAt: submittedAt,
          size: 102400,
        },
        back: {
          url: '/placeholder-photo.jpg',
          uploadedAt: submittedAt,
          size: 102400,
        },
        left: {
          url: '/placeholder-photo.jpg',
          uploadedAt: submittedAt,
          size: 102400,
        },
        right: {
          url: '/placeholder-photo.jpg',
          uploadedAt: submittedAt,
          size: 102400,
        },
        closeup: {
          url: '/placeholder-photo.jpg',
          uploadedAt: submittedAt,
          size: 102400,
        },
      },
      desiredOutcome: {
        primaryGoal: 'Restore hairline and increase density',
        specificAreas: ['hairline', 'crown'],
        expectations: 'Natural-looking results',
        timelinePreference: '3-6-months',
      },
      budgetScheduling: {
        budgetRange: params.aiScore > 80 ? '10k-15k' : params.aiScore > 60 ? '5k-10k' : 'under-5k',
        preferredContactMethod: 'email',
        availability: ['weekday-morning', 'weekday-afternoon'],
      },
      status: params.status,
      aiQualificationScore: params.aiScore,
      riskIndicators: params.riskIndicators,
      assignedDoctorId: params.doctorId,
      submittedAt,
      updatedAt: submittedAt,
      timeline: [
        {
          id: this.generateId(),
          type: 'submission',
          description: 'Assessment submitted',
          timestamp: submittedAt,
        },
        {
          id: this.generateId(),
          type: 'status-change',
          description: `Status changed to ${params.status}`,
          timestamp: new Date(submittedAt.getTime() + 86400000),
          userName: 'System',
        },
      ],
      staffNotes: params.status === 'Rejected' ? [
        {
          id: this.generateId(),
          content: 'Insufficient donor area, budget too low for multiple sessions needed',
          authorId: 'staff-1',
          authorName: 'Staff Member',
          createdAt: new Date(submittedAt.getTime() + 172800000),
        },
      ] : [],
      doctorNotes: params.doctorId ? [
        {
          id: this.generateId(),
          content: params.status === 'Qualified' || params.status === 'Booked' 
            ? 'Excellent candidate with realistic expectations' 
            : 'Reviewing medical history',
          authorId: params.doctorId,
          authorName: params.doctorId === 'doc-1' ? 'Dr. Sarah Kim' : 'Dr. Michael Chen',
          createdAt: new Date(submittedAt.getTime() + 259200000),
        },
      ] : [],
      appointments: params.hasAppointment ? [
        {
          id: this.generateId(),
          date: new Date(Date.now() + 604800000), // 7 days from now
          time: '10:00 AM',
          doctorId: params.doctorId!,
          doctorName: params.doctorId === 'doc-1' ? 'Dr. Sarah Kim' : 'Dr. Michael Chen',
          type: 'initial-consultation',
          status: 'scheduled',
        },
      ] : [],
      messages: [],
    };

    this.patients.set(patient.id, patient);
  }
}

// Export singleton instance
export const mockDataStore = new MockDataStore();

// Export class for testing
export { MockDataStore };
