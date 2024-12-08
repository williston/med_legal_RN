// lib/docx-generator.ts
import { 
    Document, 
    Paragraph, 
    TextRun, 
    HeadingLevel, 
    AlignmentType, 
    TabStopPosition, 
    TabStopType,
    BorderStyle,
    Table,
    TableRow,
    TableCell,
    WidthType
  } from 'docx';
  import type { MedicalLegalReport } from '../types/report';
  
  // Shared styles configuration
  const STYLES = {
    section: {
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
      }
    },
    subsection: {
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 120 }
    },
    content: {
      spacing: { before: 120, after: 120 },
      indent: { left: 720 }
    },
    listItem: {
      spacing: { before: 120, after: 120 },
      indent: { left: 720 },
      bullet: { level: 0 }
    },
    header: {
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.LEFT
    }
  };
  
  export function createDocument(data: MedicalLegalReport): Document {
    return new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            },
            size: {
              width: 12240,  // 8.5"
              height: 15840  // 11"
            }
          }
        },
        children: [
          ...createHeader(data.header),
          ...(data.chronological_timeline ? createTimeline(data.chronological_timeline) : []),
          ...(data.history_section ? createHistory(data.history_section) : []),
          ...(data.physical_examination ? createPhysicalExam(data.physical_examination) : []),
          ...(data.measurements ? createMeasurements(data.measurements) : []),
          ...(data.additional_observations ? createAdditionalObservations(data.additional_observations) : []),
          ...(data.closing ? createClosing(data.closing) : [])
        ]
      }]
    });
  }
  
  function createHeader(header?: MedicalLegalReport['header']): Paragraph[] {
    if (!header) return [];

    const paragraphs: Paragraph[] = [];

    if (header.examiner) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [
            new TextRun({ 
              text: header.examiner,
              bold: true,
              size: 28 
            })
          ]
        })
      );
    }

    if (header.observer) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [new TextRun({ text: header.observer, bold: true })]
        })
      );
    }

    if (header.date) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [new TextRun({ text: header.date, bold: true })]
        })
      );
    }

    if (header.specialty) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [new TextRun({ text: header.specialty, bold: true })]
        })
      );
    }

    if (header.location) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [new TextRun({ text: header.location })]
        })
      );
    }

    if (header.interpreter) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [new TextRun({ text: header.interpreter })]
        })
      );
    }

    if (header.times) {
      paragraphs.push(...createTimesSection(header.times));
    }

    if (header.audio_recording_status) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.header,
          children: [new TextRun({ 
            text: header.audio_recording_status,
            italics: true 
          })]
        })
      );
    }

    return paragraphs;
  }
  //@ts-expect-error
  function createTimesSection(times: NonNullable<MedicalLegalReport['header']['times']>): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    if (times.history) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.content,
          children: [
            new TextRun({
              text: `History: ${times.history.duration ?? ''} (${times.history.timeRange ?? ''})`,
              bold: true
            })
          ]
        })
      );
    }

    if (times.physical_exam) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.content,
          children: [
            new TextRun({
              text: `Physical Exam: ${times.physical_exam.duration ?? ''} (${times.physical_exam.timeRange ?? ''})`,
              bold: true
            })
          ]
        })
      );
    }

    if (times.total_time) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.content,
          children: [
            new TextRun({
              text: `Total Time: ${times.total_time.duration ?? ''} (${times.total_time.timeRange ?? ''})`,
              bold: true
            })
          ]
        })
      );
    }

    return paragraphs;
  }
  
  function createTimeline(timeline: MedicalLegalReport['chronological_timeline']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        ...STYLES.section,
        children: [new TextRun({ text: 'Timeline', bold: true })]
      })
    ];

    timeline?.forEach(entry => {
      if (entry.time || entry.event) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.listItem,
            children: [
              ...(entry.time ? [new TextRun({ text: entry.time, bold: true })] : []),
              new TextRun({ text: ' - ' }),
              ...(entry.event ? [new TextRun({ text: entry.event })] : []),
              ...(entry.details ? [new TextRun({ text: ` (${entry.details})` })] : [])
            ]
          })
        );
      }
    });

    return paragraphs;
  }
  

  function createHistory(historySection: MedicalLegalReport['history_section']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        ...STYLES.section,
        children: [new TextRun({ text: 'History', bold: true })]
      })
    ];
  
    // General Information
    if (historySection?.general_information) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'General Information', bold: true })]
        })
      );
  
      const generalInfo = historySection.general_information;
      
      if (generalInfo.demographics) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.content,
            children: [
              new TextRun({ text: 'Demographics: ', bold: true }),
              new TextRun({ text: generalInfo.demographics })
            ]
          })
        );
      }
  
      if (generalInfo.hand_dominance) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.content,
            children: [
              new TextRun({ text: 'Hand Dominance: ', bold: true }),
              new TextRun({ text: generalInfo.hand_dominance })
            ]
          })
        );
      }
    }
  
    // Current Symptoms
    if (historySection?.current_symptoms && historySection.current_symptoms.length > 0) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Current Symptoms', bold: true })]
        })
      );
  
      historySection.current_symptoms.forEach(symptom => {
        if (symptom.body_region) {
          paragraphs.push(
            new Paragraph({
              ...STYLES.content,
              children: [new TextRun({ text: symptom.body_region, bold: true })]
            })
          );
        }
  
        const symptomDetails = [
          symptom.pain_level !== undefined && `Pain Level: ${symptom.pain_level}/10`,
          symptom.characteristics && `Characteristics: ${symptom.characteristics}`,
          symptom.frequency && `Frequency: ${symptom.frequency}`,
          symptom.duration && `Duration: ${symptom.duration}`,
          symptom.triggers?.length && `Triggers: ${symptom.triggers.join(', ')}`,
          symptom.associated_symptoms?.length && `Associated Symptoms: ${symptom.associated_symptoms.join(', ')}`,
          symptom.treatments?.length && `Treatments: ${symptom.treatments.join(', ')}`,
          symptom.daily_impact?.length && `Daily Impact: ${symptom.daily_impact.join(', ')}`
        ].filter(Boolean);
  
        symptomDetails.forEach(detail => {
          paragraphs.push(
            new Paragraph({
              ...STYLES.listItem,
              children: [new TextRun({ text: detail as string })]
            })
          );
        });
      });
    }
  
    // Medications
    if (historySection?.medications && historySection.medications.length > 0) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Medications', bold: true })]
        })
      );
  
      historySection.medications.forEach(med => {
        const medDetails = [
          med.name,
          med.dosage,
          med.frequency,
          med.type && `(${med.type})`
        ].filter(Boolean).join(' ');
  
        if (medDetails) {
          paragraphs.push(
            new Paragraph({
              ...STYLES.listItem,
              children: [new TextRun({ text: medDetails })]
            })
          );
        }
      });
    }
  
    // Treatment History
    if (historySection?.treatment_history) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Treatment History', bold: true })]
        })
      );
  
      if (historySection.treatment_history?.current_providers && historySection.treatment_history.current_providers.length > 0) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.content,
            children: [new TextRun({ text: 'Current Providers:', bold: true })]
          })
        );
  
        historySection.treatment_history.current_providers.forEach(provider => {
          if (provider.name) {
            paragraphs.push(
              new Paragraph({
                ...STYLES.listItem,
                children: [
                  new TextRun({ text: provider.name }),
                  ...(provider.recent_appointments ? [new TextRun({ text: ` - Appointments: ${provider.recent_appointments}` })] : []),
                  ...(provider.planned_treatments ? [new TextRun({ text: ` - Planned: ${provider.planned_treatments}` })] : [])
                ]
              })
            );
          }
        });
      }
    }
  
    // Functional Assessment
    if (historySection?.functional_assessment) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Functional Assessment', bold: true })]
        })
      );
  
      const assessment = historySection.functional_assessment;
      const assessmentDetails = [
        assessment.sleep_patterns && { label: 'Sleep Patterns', value: assessment.sleep_patterns },
        assessment.daily_activities?.length && { label: 'Daily Activities', value: assessment.daily_activities.join(', ') },
        assessment.work_status && { label: 'Work Status', value: assessment.work_status },
        assessment.support_needed && { label: 'Support Needed', value: assessment.support_needed },
        assessment.mobility_status && { label: 'Mobility Status', value: assessment.mobility_status }
      ].filter(Boolean);
  
      assessmentDetails.forEach(detail => {
        if (detail) {
          paragraphs.push(
            new Paragraph({
              ...STYLES.content,
              children: [
                new TextRun({ text: `${detail.label}: `, bold: true }),
                new TextRun({ text: detail.value })
              ]
            })
          );
        }
      });
    }
  
    return paragraphs;
  }
  
  function createPhysicalExam(exam: MedicalLegalReport['physical_examination']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        ...STYLES.section,
        children: [new TextRun({ text: 'Physical Examination', bold: true })]
      })
    ];
  
    exam?.forEach(section => {
      if (section.body_region) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.subsection,
            children: [new TextRun({ text: section.body_region, bold: true })]
          })
        );
      }
  
      if (section.starting_position) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.content,
            children: [
              new TextRun({ text: 'Starting Position: ', bold: true }),
              new TextRun({ text: section.starting_position })
            ]
          })
        );
      }
  
      section.tests?.forEach(test => {
        paragraphs.push(
          new Paragraph({
            ...STYLES.listItem,
            children: [
              ...(test.name ? [new TextRun({ text: `${test.name}: `, bold: true })] : []),
              ...(test.instructions ? [new TextRun({ text: `${test.instructions} ` })] : []),
              ...(test.performance ? [new TextRun({ text: test.performance })] : []),
              ...(test.pain_response ? [new TextRun({ text: ` (Pain: ${test.pain_response})`, italics: true })] : [])
            ]
          })
        );
      });
    });
  
    return paragraphs;
  }
  
  ///////


  function createMeasurements(measurements: MedicalLegalReport['measurements']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        ...STYLES.section,
        children: [new TextRun({ text: 'Measurements', bold: true })]
      })
    ];
  
    // Grip Strength
    if (measurements?.grip_strength) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Grip Strength', bold: true })]
        })
      );
  
      if (measurements.grip_strength.left && measurements.grip_strength.left.length > 0) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.content,
            children: [
              new TextRun({ text: 'Left: ', bold: true }),
              new TextRun({ text: measurements.grip_strength.left.join(', ') })
            ]
          })
        );
      }
  
      if (measurements.grip_strength.right && measurements.grip_strength.right.length > 0) {
        paragraphs.push(
          new Paragraph({
            ...STYLES.content,
            children: [
              new TextRun({ text: 'Right: ', bold: true }),
              new TextRun({ text: measurements.grip_strength.right.join(', ') })
            ]
          })
        );
      }
    }
  
    // Circumference
    if (measurements?.circumference) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Circumference', bold: true })]
        }),
        new Paragraph({
          ...STYLES.content,
          children: [
            new TextRun({ text: `${measurements.circumference.location}: `, bold: true }),
            new TextRun({ text: `${measurements.circumference.value}${measurements.circumference.unit}` })
          ]
        })
      );
    }
  
    // Range of Motion
    if (measurements?.range_of_motion) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Range of Motion', bold: true })]
        }),
        new Paragraph({
          ...STYLES.content,
          children: [
            new TextRun({ text: `${measurements.range_of_motion.joint}: `, bold: true }),
            new TextRun({ text: `${measurements.range_of_motion.degrees}°` })
          ]
        })
      );
    }
  
    return paragraphs;
  }
  
  function createAdditionalObservations(observations: MedicalLegalReport['additional_observations']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        ...STYLES.section,
        children: [new TextRun({ text: 'Additional Observations', bold: true })]
      })
    ];
  
    // Measurement Notes
    if (observations?.measurement_notes && observations.measurement_notes.length > 0) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Measurement Notes', bold: true })]
        }),
        ...observations.measurement_notes.map(note =>
          new Paragraph({
            ...STYLES.listItem,
            children: [new TextRun({ text: note })]
          })
        )
      );
    }
  
    // Limitations
    if (observations?.limitations && observations.limitations.length > 0) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Limitations', bold: true })]
        }),
        ...observations.limitations.map(limitation =>
          new Paragraph({
            ...STYLES.listItem,
            children: [new TextRun({ text: limitation })]
          })
        )
      );
    }
  
    // Patient Positioning
    if (observations?.patient_positioning && observations.patient_positioning.length > 0) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Patient Positioning', bold: true })]
        }),
        ...observations.patient_positioning.map(position =>
          new Paragraph({
            ...STYLES.listItem,
            children: [new TextRun({ text: position })]
          })
        )
      );
    }
  
    // Omissions
    if (observations?.omissions && observations.omissions.length > 0) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.subsection,
          children: [new TextRun({ text: 'Omissions', bold: true })]
        }),
        ...observations.omissions.map(omission =>
          new Paragraph({
            ...STYLES.listItem,
            children: [new TextRun({ text: omission })]
          })
        )
      );
    }
  
    return paragraphs;
  }
  
  function createClosing(closing: MedicalLegalReport['closing']): Paragraph[] {
    const paragraphs: Paragraph[] = [];
  
    // Add extra spacing before closing section
    paragraphs.push(new Paragraph({ spacing: { before: 400 } }));
  
    // Attestation
    if (closing?.attestation) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.content,
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: closing.attestation,
              bold: true
            })
          ]
        })
      );
    }
  
    // Execution details
    if (closing?.execution_date || closing?.execution_location) {
      paragraphs.push(
        new Paragraph({
          ...STYLES.content,
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `Executed on ${closing.execution_date ?? '[Date]'}, at ${closing.execution_location ?? '[Location]'}`
            })
          ]
        })
      );
    }
  
    // Add spacing before signature
    paragraphs.push(new Paragraph({ spacing: { before: 400 } }));
  
    // Signature
    if (closing?.examiner_signature) {
      const signature = closing.examiner_signature;
      const nameAndCredentials = [
        signature.name,
        signature.credentials && `, ${signature.credentials}`
      ].filter(Boolean).join('');
  
      if (nameAndCredentials) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: nameAndCredentials, bold: true })]
          })
        );
      }
    }
  
    return paragraphs;
  }
