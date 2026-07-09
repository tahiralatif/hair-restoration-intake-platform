// AI Qualification Score Calculation and Risk Detection

import { Patient, AIScoreBreakdown, RiskIndicator } from './types';

// ============================================================================
// AI Score Calculation
// ============================================================================

export function calculateAIScore(patient: Partial<Patient>): AIScoreBreakdown {
  let medicalScore = 0;
  let expectationsScore = 0;
  let budgetScore = 0;
  let photoScore = 0;

  // Medical Suitability (40 points)
  if (patient.personalInfo?.age) {
    if (patient.personalInfo.age >= 25 && patient.personalInfo.age <= 65) {
      medicalScore += 15;
    } else if (patient.personalInfo.age > 18) {
      medicalScore += 10;
    }
  }

  if (patient.hairLossHistory) {
    if (patient.hairLossHistory.progressionRate === 'slow') medicalScore += 10;
    else if (patient.hairLossHistory.progressionRate === 'moderate') medicalScore += 8;
    else medicalScore += 5;

    if (!patient.hairLossHistory.medicalConditions || patient.hairLossHistory.medicalConditions.length === 0) {
      medicalScore += 15;
    } else {
      medicalScore += 5;
    }
  }

  // Realistic Expectations (30 points)
  if (patient.desiredOutcome) {
    const goalLength = patient.desiredOutcome.primaryGoal?.length || 0;
    if (goalLength > 50 && goalLength < 400) expectationsScore += 15;
    else if (goalLength > 0) expectationsScore += 10;

    if (patient.desiredOutcome.specificAreas && patient.desiredOutcome.specificAreas.length > 0 && patient.desiredOutcome.specificAreas.length <= 3) {
      expectationsScore += 15;
    } else if (patient.desiredOutcome.specificAreas && patient.desiredOutcome.specificAreas.length > 0) {
      expectationsScore += 10;
    }
  }

  // Budget Alignment (20 points)
  if (patient.budgetScheduling) {
    const budget = patient.budgetScheduling.budgetRange;
    if (budget === '10k-15k' || budget === 'over-15k') budgetScore += 20;
    else if (budget === '5k-10k') budgetScore += 15;
    else if (budget === 'under-5k') budgetScore += 10;
    else budgetScore += 5;
  }

  // Photo Quality (10 points)
  if (patient.photos) {
    const photoCount = Object.keys(patient.photos).length;
    if (photoCount >= 6) photoScore += 10;
    else if (photoCount >= 4) photoScore += 7;
    else if (photoCount >= 2) photoScore += 4;
  }

  const totalScore = medicalScore + expectationsScore + budgetScore + photoScore;

  return {
    totalScore,
    factors: {
      medicalSuitability: {
        score: medicalScore,
        details: `Age, progression rate, and medical history assessment: ${medicalScore}/40`,
      },
      realisticExpectations: {
        score: expectationsScore,
        details: `Goal clarity and specific area selection: ${expectationsScore}/30`,
      },
      budgetAlignment: {
        score: budgetScore,
        details: `Budget range compatibility with treatment options: ${budgetScore}/20`,
      },
      photoQuality: {
        score: photoScore,
        details: `Number and quality of submitted photos: ${photoScore}/10`,
      },
    },
  };
}

// ============================================================================
// Risk Indicator Detection
// ============================================================================

export function detectRiskIndicators(patient: Partial<Patient>): RiskIndicator[] {
  const risks: RiskIndicator[] = [];

  // Medical History Risks
  if (patient.hairLossHistory?.medicalConditions && patient.hairLossHistory.medicalConditions.length > 0) {
    risks.push({
      id: `risk-medical-${Date.now()}`,
      category: 'medical-history',
      severity: 'medium',
      description: `Patient has ${patient.hairLossHistory.medicalConditions.length} pre-existing medical condition(s) that may affect treatment eligibility`,
    });
  }

  if (patient.hairLossHistory?.progressionRate === 'rapid') {
    risks.push({
      id: `risk-progression-${Date.now()}`,
      category: 'medical-history',
      severity: 'high',
      description: 'Rapid hair loss progression may indicate underlying medical issues requiring additional screening',
    });
  }

  if (patient.personalInfo?.age && patient.personalInfo.age < 25) {
    risks.push({
      id: `risk-age-${Date.now()}`,
      category: 'medical-history',
      severity: 'medium',
      description: 'Patient is under 25 years old. Hair loss pattern may not be fully established',
    });
  }

  // Unrealistic Expectations Risks
  if (patient.desiredOutcome?.specificAreas && patient.desiredOutcome.specificAreas.length > 4) {
    risks.push({
      id: `risk-expectations-${Date.now()}`,
      category: 'unrealistic-expectations',
      severity: 'medium',
      description: 'Patient has concerns about multiple areas which may require consultation to manage expectations',
    });
  }

  const goalLength = patient.desiredOutcome?.primaryGoal?.length || 0;
  if (goalLength < 20 || goalLength > 500) {
    risks.push({
      id: `risk-goal-clarity-${Date.now()}`,
      category: 'unrealistic-expectations',
      severity: 'low',
      description: 'Patient goal description needs clarification during consultation',
    });
  }

  // Budget Constraints Risks
  if (patient.budgetScheduling?.budgetRange === 'under-5k') {
    risks.push({
      id: `risk-budget-${Date.now()}`,
      category: 'budget-constraints',
      severity: 'high',
      description: 'Budget may be insufficient for comprehensive hair restoration treatment. Financial counseling recommended',
    });
  } else if (patient.budgetScheduling?.budgetRange === 'need-consultation') {
    risks.push({
      id: `risk-budget-unknown-${Date.now()}`,
      category: 'budget-constraints',
      severity: 'low',
      description: 'Budget needs to be determined during consultation',
    });
  }

  return risks;
}

// ============================================================================
// Score Color Coding
// ============================================================================

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-blue-100';
  if (score >= 40) return 'bg-yellow-100';
  return 'bg-red-100';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Candidate';
  if (score >= 60) return 'Good Candidate';
  if (score >= 40) return 'Fair Candidate';
  return 'Consultation Needed';
}
