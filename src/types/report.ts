// types/report.ts
export interface MedicalLegalReport {
    header: {
      examiner: {
        name: string;
        credentials: string;
      };
      observer: {
        name: string;
        credentials: string;
      };
      specialty: string;
      location: string;
      interpreter?: {
        name: string;
        certification: string;
        expiration: string;
      };
      times: {
        history: {
          duration: string;
          timeRange: string;
        };
        physicalExam: {
          duration: string;
          timeRange: string;
        };
        totalTime: {
          duration: string;
          timeRange: string;
        };
      };
      recordingNote: string;
    };
    timeline: Array<{
      time: string;
      event: string;
      details?: string;
    }>;
    history: {
      generalInfo: {
        demographics: Record<string, string>;
        identification: string;
      };
      currentSymptoms: Array<{
        region: string;
        pain: {
          level: number;
          characteristics: string[];
          frequency: string;
          triggers?: string[];
          alleviatingFactors?: string[];
        };
        functionalImpact: string[];
        treatments: string[];
      }>;
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        purpose?: string;
      }>;
      treatmentHistory: {
        currentProviders: Array<{
          name: string;
          specialty: string;
          lastVisit: string;
          nextVisit?: string;
        }>;
        pastTreatments: string[];
        plannedTreatments?: string[];
      };
      functionalAssessment: {
        sleep: {
          pattern: string;
          issues: string[];
          aids?: string[];
        };
        adl: {
          independent: string[];
          needsAssistance: string[];
          unable: string[];
        };
        mobility: string;
        work: string;
      };
    };
    physicalExam: Array<{
      section: string;
      position: string;
      tests: Array<{
        name: string;
        instructions: string;
        performance: string;
        painResponse?: string;
        measurements?: Record<string, number | string>;
      }>;
    }>;
    measurements: {
      grip: Record<string, number[]>;
      circumference: Record<string, Record<string, number>>;
      rangeOfMotion: Record<string, Record<string, number>>;
    };
    additionalObservations: string[];
    execution: {
      date: string;
      location: string;
      observer: {
        name: string;
        credentials: string;
      };
    };
  }