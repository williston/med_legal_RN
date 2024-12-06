// lib/openai.ts
import OpenAI from 'openai';
import { MedicalLegalReport } from '@/types/report';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReportContent(transcript: string): Promise<MedicalLegalReport> {
  const systemPrompt = `Create a detailed medical-legal examination report following this specific format and structure:

1. HEADER FORMAT:
[Examiner]: [Name, Credentials]
[Observer]: [Name, Credentials]
[Specialty]
[Location]
[Interpreter]: (if applicable - include certification and expiration)

[History]: [Duration] (Start-End time)
[Physical Exam]: [Duration] (Start-End time)
[Total Time in Office]: [Duration] (Start-End time)
*Times approximate and can vary by up to a minute.
Audio recording status and special conditions (e.g., masks, COVID protocols)

2. CHRONOLOGICAL TIMELINE:
Format each entry: [TIME] -- [Event]
Document:
- Initial meeting location and patient attire
- Entry procedures
- Recording starts/stops
- Room transitions
- Provider entry
- Interview start
- Exam phases
- Conclusion
- Departure

3. HISTORY SECTION:
A. General Information:
- Demographics
- Hand dominance
- ID verification method

B. Current Symptoms:
Document by body region:
- Pain characteristics
- Pain scale ratings (0-10)
- Frequency
- Duration
- Triggers
- Associated symptoms
- Treatment methods
- Impact on daily activities

C. Medications:
- Current medications with dosages
- Frequency
- Non-prescription medications

D. Treatment History:
- Current providers
- Recent appointments
- Planned treatments
- Past procedures

E. Functional Assessment:
- Sleep patterns
- Daily activities
- Work status
- Support needed
- Mobility status

4. PHYSICAL EXAMINATION:
A. Document each test with:
- Starting position
- Instructions given
- Patient's performance
- Pain responses
- Observable behaviors

B. Organize by body region:
- Vital signs
- Neurological testing
- Range of motion
- Strength testing
- Sensation testing
- Special tests
- Measurements with exact values

C. Include specific measurements:
- Grip strength readings
- Circumference measurements
- Range of motion degrees
- Reflex testing results

5. FORMATTING REQUIREMENTS:
- Use bold for timestamps and headers
- Maintain chronological order
- Use clear section breaks
- Implement hierarchical bullet points
- Include timestamps for significant transitions

6. DOCUMENTATION STANDARDS:
- Document patient reactions
- Note any limitations
- Record measurement methods
- Include technical notes
- Note any deviations from standard practice

7. ADDITIONAL OBSERVATIONS:
- Note if measurements are observational vs objective
- Document any omissions
- Record examination limitations
- Note patient attire/positioning throughout

8. CLOSING:
Standard legal attestation:
"I verify under penalty of perjury under the laws of the state of [State], that the information contained here is true and correct.

Executed on [Date], at [Location]

[Name, Credentials]"

9. GENERAL GUIDELINES:
- Maintain objective, clinical language
- Document verbatim responses when relevant
- Note any assistance required
- Record all observable behaviors
- Include all measurements with exact values
- Document any incomplete tests or limitations
- Note patient cooperation and effort
- Record any breaks or interruptions

Reminder: All pain levels, measurements, and observations must be specifically documented with exact values when provided in the audio recording. Any omissions or observational (versus objective) measurements should be noted in the additional observations section.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
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