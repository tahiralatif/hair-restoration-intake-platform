// Core Type Definitions for Hair Restoration Patient Intake Platform

// ============================================================================
// Patient Status and Classification Types
// ============================================================================

export type PatientStatus = 'Submitted' | 'Under Review' | 'Qualified' | 'Booked' | 'Rejected';

export type NorwoodScale = '1' | '2' | '3' | '3A' | '3V' | '4' | '4A' | '5' | '5A' | '5V' | '6' | '6A' | '7';

export type Gender = 'male' | 'female' | 'other';

export type ProgressionRate = 'slow' | 'moderate' | 'rapid';

export type TransplantMethod = 'FUE' | 'FUT' | 'other';

export type SatisfactionLevel = 'unsatisfied' | 'neutral' | 'satisfied';

export type TreatmentEffectiveness = 'not-effective' | 'somewhat-effective' | 'very-effective';

export type TimelinePreference = 'asap' | '3-6-months' | '6-12-months' | 'flexible';

export type BudgetRange = 'under-5k' | '5k-10k' | '10k-15k' | 'over-15k' | 'need-consultation';

export type ContactMethod = 'phone' | 'email' | 'sms';

export type AppointmentType = 'initial-consultation' | 'follow-up' | 'procedure';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type MessageSender = 'patient' | 'staff' | 'doctor';

export type TimelineEventType = 
  | 'submission' 
  | 'status-change' 
  | 'doctor-assigned' 
  | 'note-added' 
  | 'appointment-scheduled' 
  | 'message-sent';

export type RiskCategory = 'medical-history' | 'unrealistic-expectations' | 'budget-constraints';

export type RiskSeverity = 'low' | 'medium' | 'high';

export type PhotoAngle = 'front' | 'top' | 'back' | 'left' | 'right' | 'closeup';

// ============================================================================
// Personal Information Types
// ============================================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  address: Address;
}

// ============================================================================
// Medical History Types
// ============================================================================

export interface HairLossHistory {
  ageWhenStarted: number;
  familyHistory: boolean;
  progressionRate: ProgressionRate;
  affectedAreas: string[];
  medicalConditions: string[];
  medications: string[];
}

export interface CurrentTreatments {
  usingMinoxidil: boolean;
  usingFinasteride: boolean;
  usingOtherMedications: string[];
  duration: string;
  effectiveness: TreatmentEffectiveness;
}

export interface PreviousTransplants {
  hadPreviousTransplant: boolean;
  transplantDate?: string;
  transplantMethod?: TransplantMethod;
  graftsTransplanted?: number;
  satisfaction?: SatisfactionLevel;
}

// ============================================================================
// Photo and Document Types
// ============================================================================

export interface PhotoData {
  url: string; // base64 or blob URL
  uploadedAt: Date;
  size: number; // bytes
  fileName?: string;
}

export interface PatientPhotos {
  front?: PhotoData;
  top?: PhotoData;
  back?: PhotoData;
  left?: PhotoData;
  right?: PhotoData;
  closeup?: PhotoData;
}

// ============================================================================
// Desired Outcome Types
// ============================================================================

export interface DesiredOutcome {
  primaryGoal: string;
  specificAreas: string[];
  expectations: string;
  timelinePreference: TimelinePreference;
}

// ============================================================================
// Budget and Scheduling Types
// ============================================================================

export interface BudgetScheduling {
  budgetRange: BudgetRange;
  preferredContactMethod: ContactMethod;
  availability: string[];
}

// ============================================================================
// Risk and Qualification Types
// ============================================================================

export interface RiskIndicator {
  id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  description: string;
}

export interface AIScoreBreakdown {
  totalScore: number; // 0-100
  factors: {
    medicalSuitability: {
      score: number; // out of 40
      details: string;
    };
    realisticExpectations: {
      score: number; // out of 30
      details: string;
    };
    budgetAlignment: {
      score: number; // out of 20
      details: string;
    };
    photoQuality: {
      score: number; // out of 10
      details: string;
    };
  };
}

// ============================================================================
// Timeline and Activity Types
// ============================================================================

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

// ============================================================================
// Appointment Types
// ============================================================================

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctorId: string;
  doctorName: string;
  type: AppointmentType;
  status: AppointmentStatus;
}

// ============================================================================
// Messaging Types
// ============================================================================

export interface Message {
  id: string;
  from: MessageSender;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// ============================================================================
// Core Patient Type
// ============================================================================

export interface Patient {
  id: string;
  personalInfo: PersonalInfo;
  hairLossHistory: HairLossHistory;
  currentTreatments: CurrentTreatments;
  previousTransplants: PreviousTransplants;
  norwoodScale?: NorwoodScale;
  photos: PatientPhotos;
  desiredOutcome: DesiredOutcome;
  budgetScheduling: BudgetScheduling;
  status: PatientStatus;
  aiQualificationScore: number;
  riskIndicators: RiskIndicator[];
  assignedDoctorId?: string;
  submittedAt: Date;
  updatedAt: Date;
  timeline: TimelineEvent[];
  staffNotes: Note[];
  doctorNotes: Note[];
  appointments: Appointment[];
  messages: Message[];
}

// ============================================================================
// Doctor Type
// ============================================================================

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  assignedPatientIds: string[];
}

// ============================================================================
// Filter Types
// ============================================================================

export interface PatientFilters {
  status?: PatientStatus[];
  norwoodScale?: NorwoodScale[];
  aiScoreRange?: { min: number; max: number };
  dateRange?: { start: Date; end: Date };
  assignedDoctorId?: string;
  searchQuery?: string;
}

// ============================================================================
// Assessment Flow Types
// ============================================================================

export interface AssessmentState {
  currentStep: number;
  formData: Partial<Patient>;
  resumeCode?: string;
  isComplete: boolean;
}

export interface SavedAssessment {
  resumeCode: string;
  formData: Partial<Patient>;
  currentStep: number;
  savedAt: Date;
  expiresAt: Date;
}

// ============================================================================
// User and Auth Types (Mock)
// ============================================================================

export type UserRole = 'patient' | 'staff' | 'doctor' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface DashboardStatistics {
  totalApplications: number;
  qualifiedPatients: number;
  pendingReviews: number;
  bookedConsultations: number;
  rejectedApplications: number;
  conversionRate: number; // qualified/total
  bookingRate: number; // booked/qualified
  averageAIScore: number;
  averageTimeToQualification: number; // in hours
}

// ============================================================================
// Chart Data Types
// ============================================================================

export interface ApplicationsByMonthData {
  month: string;
  count: number;
}

export interface StatusDistributionData {
  status: PatientStatus;
  count: number;
  percentage: number;
}

export interface NorwoodDistributionData {
  stage: NorwoodScale;
  count: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormStep {
  number: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}
