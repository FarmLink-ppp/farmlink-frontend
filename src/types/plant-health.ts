export interface PlantHealthScan {
  id: number;
  image_url: string;
  user_id: number;
  scan_date: string;
}

export interface PlantHealthDiagnostic {
  id: number;
  issue_detected: boolean;
  disease_name: string;
  confidence_score: number;
  description: string;
  treatment: string;
  prevention: string;
  created_at: string;
  scan_id: number;
}

export interface CreateScanResponse {
  diagnostic: PlantHealthDiagnostic;
}

export interface ScanWithDiagnosis {
  imageUrl: string;
  diagnostic: PlantHealthDiagnostic | null;
}
