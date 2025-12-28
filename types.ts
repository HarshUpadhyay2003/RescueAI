
export interface MapAnalysis {
  safeZones: string[];
  blockedRoutes: string[];
  rescueApproach: string;
  // English fallbacks
  safeZones_en?: string[];
  blockedRoutes_en?: string[];
  rescueApproach_en?: string;
}

export interface Scenario {
  description: string;
  probability: string;
  nextSteps: string;
  // English fallbacks
  description_en?: string;
  nextSteps_en?: string;
}

export interface DisasterReport {
  language: string;
  localizationConfidence?: Record<string, string>;

  disasterType: string;
  disasterType_en?: string;

  severityScore: number;
  
  severityRationale: string[];
  severityRationale_en?: string[];

  // Relaxed to string to allow localized values (e.g., "Alta", "Crítica")
  urgencyLevel: string; 
  // Strict English enum for logic
  urgencyLevel_en?: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Unknown';

  peopleAtRisk: string;
  peopleAtRisk_en?: string;

  visualEvidence: string[];
  visualEvidence_en?: string[];

  visualFeatureMap: string[];
  visualFeatureMap_en?: string[];

  requiredResources: string[];
  requiredResources_en?: string[];

  responsePlan: string[];
  responsePlan_en?: string[];

  responderModePlan: string[];
  responderModePlan_en?: string[];

  citizenModePlan: string[];
  citizenModePlan_en?: string[];

  safetyPrecautions: string[];
  safetyPrecautions_en?: string[];

  equipmentChecklist: string[];
  equipmentChecklist_en?: string[];

  shareableSummary: string;
  shareableSummary_en?: string;

  immediateAction: string;
  immediateAction_en?: string;

  mapAnalysis?: MapAnalysis;
  scenarios?: Scenario[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  report: DisasterReport | null;
}
