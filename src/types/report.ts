// src/types/report.ts
export interface MedicalLegalReport {
    header?: {
      examiner?: string;
      observer?: string;
      date?: string;
      specialty?: string;
      location?: string;
      interpreter?: string;
      times?: {
        history?: {
          duration?: string;
          timeRange?: string; // HH:MM-HH:MM
        };
        physical_exam?: {
          duration?: string;
          timeRange?: string; // HH:MM-HH:MM
        };
        total_time?: {
          duration?: string;
          timeRange?: string; // HH:MM-HH:MM
        };
      };
      audio_recording_status?: string;
      special_conditions?: string;
    };
  
    chronological_timeline?: Array<{
      time?: string; // HH:MM
      event?: string;
      details?: string;
    }>;
  
    history_section?: {
      general_information?: {
        demographics?: string;
        hand_dominance?: string;
        id_verification?: string;
      };
      current_symptoms?: Array<{
        body_region?: string;
        pain_level?: number;
        characteristics?: string;
        frequency?: string;
        duration?: string;
        triggers?: string[];
        associated_symptoms?: string[];
        treatments?: string[];
        daily_impact?: string[];
      }>;
      medications?: Array<{
        name?: string;
        dosage?: string;
        frequency?: string;
        type?: string; // prescription/non-prescription
      }>;
      treatment_history?: {
        current_providers?: Array<{
          name?: string;
          recent_appointments?: string;
          planned_treatments?: string;
        }>;
        past_procedures?: string[];
      };
      functional_assessment?: {
        sleep_patterns?: string;
        daily_activities?: string[];
        work_status?: string;
        support_needed?: string;
        mobility_status?: string;
      };
    };
  
    physical_examination?: Array<{
      body_region?: string;
      starting_position?: string;
      tests?: Array<{
        name?: string;
        instructions?: string;
        performance?: string;
        pain_response?: string;
        measurements?: {
          value?: number;
          unit?: string;
        };
      }>;
    }>;
  
    measurements?: {
      grip_strength?: {
        left?: number[];
        right?: number[];
      };
      circumference?: {
        location?: string;
        value?: number;
        unit?: string;
      };
      range_of_motion?: {
        joint?: string;
        degrees?: number;
      };
    };
  
    additional_observations?: {
      measurement_notes?: string[];
      limitations?: string[];
      patient_positioning?: string[];
      omissions?: string[];
    };
  
    closing?: {
      attestation?: string;
      execution_date?: string;
      execution_location?: string;
      examiner_signature?: {
        name?: string;
        credentials?: string;
      };
  };
}
