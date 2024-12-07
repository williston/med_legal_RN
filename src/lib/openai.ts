// lib/openai.ts
import OpenAI from 'openai';
import { MedicalLegalReport } from '@/types/report';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReportContent(transcript: string): Promise<MedicalLegalReport> {
  const systemPrompt = `Create a medical-legal examination report following this exact JSON structure:
{
  "header": {
    "examiner": "string",
    "observer": "string",
    "date": "string (YYYY-MM-DD)",
    "specialty": "string",
    "location": "string",
    "interpreter": "string",
    "times": {
      "history": {
        "duration": "string",
        "timeRange": "string (HH:MM-HH:MM)"
      },
      "physical_exam": {
        "duration": "string",
        "timeRange": "string (HH:MM-HH:MM)"
      },
      "total_time": {
        "duration": "string",
        "timeRange": "string (HH:MM-HH:MM)"
      }
    },
    "audio_recording_status": "string",
    "special_conditions": "string"
  },
  "chronological_timeline": [
    {
      "time": "string (HH:MM)",
      "event": "string",
      "details": "string (optional)"
    }
  ],
  "history_section": {
    "general_information": {
      "demographics": "string",
      "hand_dominance": "string",
      "id_verification": "string"
    },
    "current_symptoms": [
      {
        "body_region": "string",
        "pain_level": "number (0-10)",
        "characteristics": "string",
        "frequency": "string",
        "duration": "string",
        "triggers": "string[]",
        "associated_symptoms": "string[]",
        "treatments": "string[]",
        "daily_impact": "string[]"
      }
    ],
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "type": "string (prescription/non-prescription)"
      }
    ],
    "treatment_history": {
      "current_providers": [
        {
          "name": "string",
          "recent_appointments": "string",
          "planned_treatments": "string"
        }
      ],
      "past_procedures": "string[]"
    },
    "functional_assessment": {
      "sleep_patterns": "string",
      "daily_activities": "string[]",
      "work_status": "string",
      "support_needed": "string",
      "mobility_status": "string"
    }
  },
  "physical_examination": [
    {
      "body_region": "string",
      "starting_position": "string",
      "tests": [
        {
          "name": "string",
          "instructions": "string",
          "performance": "string",
          "pain_response": "string",
          "measurements": {
            "value": "number",
            "unit": "string"
          }
        }
      ]
    }
  ],
  "measurements": {
    "grip_strength": {
      "left": "number[]",
      "right": "number[]"
    },
    "circumference": {
      "location": "string",
      "value": "number",
      "unit": "string"
    },
    "range_of_motion": {
      "joint": "string",
      "degrees": "number"
    }
  },
  "additional_observations": {
    "measurement_notes": "string[]",
    "limitations": "string[]",
    "patient_positioning": "string[]",
    "omissions": "string[]"
  },
  "closing": {
    "attestation": "string",
    "execution_date": "string",
    "execution_location": "string",
    "examiner_signature": {
      "name": "string",
      "credentials": "string"
    }
  }
}

Important:
1. Follow this exact structure
2. Do not add additional fields
3. Use empty objects ({}) for sections without data
4. All timestamps should be in HH:MM format
5. Keep all field names exactly as shown

Additional Context and Requirements:

1. VISIT CONTEXT:
- This is a medical-legal examination where a nurse observer documents the entire physician office visit
- Documentation must be precise, objective, and chronological
- Include all interactions: patient, staff, physician, and nurse observer
- Note exact times for all significant events

2. DOCUMENTATION PRIORITIES:
- Patient arrival condition and demeanor
- Waiting room observations
- Staff interactions and procedures
- Detailed injury history and mechanism
- Current symptoms and their progression
- Impact on activities of daily living
- Work status and modifications
- Treatment history effectiveness
- Medication responses
- Physical examination procedures and findings
- Patient effort and cooperation level
- Any pain responses or behavioral observations
- All measurements and test results
- Any interruptions or unusual circumstances

3. SPECIFIC DETAILS TO CAPTURE:
- Exact arrival and departure times
- Time spent in waiting area
- Duration of history taking
- Duration of physical examination
- Names and roles of all staff involved
- Patient's gait and mobility observations
- Pain behaviors or expressions
- Examination room transitions
- Any breaks or interruptions
- Use of assistive devices
- Patient positioning changes
- Any difficulty with examination procedures
- Specific test performances and limitations

4. EXAMINATION COMPONENTS:
For Comprehensive Exams:
- Full body systems review
- Detailed neurological testing
- Complete range of motion
- Strength testing all major muscle groups
- Sensation testing
- Special tests specific to injury
- Multiple measurements and readings

For Focused Exams:
- Targeted to specific body region
- Relevant special tests
- Comparative measurements
- Functional testing specific to injury

5. BEHAVIORAL OBSERVATIONS:
- Pain behaviors
- Effort level
- Consistency of symptoms
- Cooperation with examination
- Interaction with staff
- Movement patterns
- Use of assistive devices
- Changes in behavior during different activities

Remember:
- Maintain objective, clinical language
- Document exact times for all events
- Include all interactions with staff and providers
- Note any deviations from normal procedures
- Record all measurements precisely
- Document any limitations or incomplete tests
- Note patient's cooperation and effort level
- Include all relevant observations about function and behavior

The report should provide a complete, objective record of the entire visit that would be suitable for medical-legal purposes.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `${systemPrompt}\nRespond with a JSON object following the specified format.`
      },
      {
        role: "user",
        content: `Generate a JSON report from this transcript: ${transcript}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No content received from OpenAI");
  
  return JSON.parse(content);
}