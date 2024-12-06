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
  
  export function createDocument(data: MedicalLegalReport): Document {
    return new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          ...(data.header ? createHeader(data.header) : []),
          ...(data.timeline ? createTimeline(data.timeline) : []),
          ...(data.history ? createHistory(data.history) : []),
          ...(data.physicalExam ? createPhysicalExam(data.physicalExam) : []),
          ...(data.measurements ? createMeasurements(data.measurements) : []),
          ...(data.additionalObservations ? createAdditionalObservations(data.additionalObservations) : []),
          ...(data.execution ? createExecution(data.execution) : [])
        ]
      }]
    });
  }
  
  function createHeader(header: MedicalLegalReport['header']): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    if (header.examiner?.name && header.examiner?.credentials) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: `Examiner: ${header.examiner.name}, ${header.examiner.credentials}`,
              bold: true
            })
          ]
        })
      );
    }

    if (header.specialty) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: header.specialty,
              bold: true
            })
          ]
        })
      );
    }

    if (header.location) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: header.location,
              bold: true
            })
          ]
        })
      );
    }

    if (header.times) {
      paragraphs.push(...createTimesSection(header.times));
    }

    if (header.recordingNote) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: header.recordingNote,
              italics: true
            })
          ]
        })
      );
    }

    return paragraphs;
  }
  
  function createTimeline(timeline: MedicalLegalReport['timeline']): Paragraph[] {
    if (!Array.isArray(timeline)) return [];
    
    return timeline.map(entry => {
      if (!entry?.time) return new Paragraph({ children: [] });
      
      return new Paragraph({
        children: [
          new TextRun({
            text: `${entry.time} -- `,
            bold: true
          }),
          new TextRun({
            text: entry.event || ''
          }),
          ...(entry.details ? [
            new TextRun({
              text: ` ${entry.details}`
            })
          ] : [])
        ]
      });
    });
  }
  
  function createHistory(history: MedicalLegalReport['history']): Paragraph[] {
    const sections: Paragraph[] = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'History', bold: true })]
      })
    ];

    if (history.generalInfo) {
      sections.push(...createGeneralInfo(history.generalInfo));
    }
    
    if (history.currentSymptoms) {
      sections.push(...createSymptoms(history.currentSymptoms));
    }
    
    if (history.medications) {
      sections.push(...createMedications(history.medications));
    }
    
    if (history.treatmentHistory) {
      sections.push(...createTreatmentHistory(history.treatmentHistory));
    }
    
    if (history.functionalAssessment) {
      sections.push(...createFunctionalAssessment(history.functionalAssessment));
    }

    return sections;
  }
  
  function createPhysicalExam(exam: MedicalLegalReport['physicalExam']): Paragraph[] {
    if (!Array.isArray(exam)) return [];

    const sections: Paragraph[] = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Physical Examination', bold: true })]
      })
    ];

    exam.forEach(section => {
      if (section?.section) {
        sections.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: section.section, bold: true })]
          })
        );

        if (section.position) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: `Position: ${section.position}` })]
            })
          );
        }

        if (Array.isArray(section.tests)) {
          section.tests.forEach(test => {
            if (test?.name) {
              sections.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `${test.name}: `, bold: true }),
                    new TextRun({ text: test.instructions || '' }),
                    new TextRun({ text: ` ${test.performance || ''}` }),
                    ...(test.painResponse ? [
                      new TextRun({ text: ` Pain Response: ${test.painResponse}` })
                    ] : [])
                  ]
                })
              );
            }
          });
        }
      }
    });

    return sections;
  }
  
  function createMeasurements(measurements: MedicalLegalReport['measurements']): Paragraph[] {
    if (!measurements) return [];

    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Measurements', bold: true })]
      })
      // Add measurement-specific paragraphs here if needed
    ];
  }
  
  function createAdditionalObservations(observations: string[]): Paragraph[] {
    if (!Array.isArray(observations)) return [];

    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Additional Observations', bold: true })]
      }),
      ...observations.map(obs => 
        new Paragraph({
          children: [new TextRun({ text: `• ${obs}` })]
        })
      )
    ];
  }
  
  function createExecution(execution: MedicalLegalReport['execution']): Paragraph[] {
    if (!execution) return [];

    const paragraphs: Paragraph[] = [
      new Paragraph({ children: [new TextRun({ text: '\n' })] }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'I verify under penalty of perjury under the laws of the state of California, that the information contained here is true and correct.',
            bold: true
          })
        ]
      })
    ];

    if (execution.date && execution.location) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Executed on ${execution.date}, at ${execution.location}`
            })
          ]
        })
      );
    }

    if (execution.observer?.name && execution.observer?.credentials) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${execution.observer.name}, ${execution.observer.credentials}`
            })
          ]
        })
      );
    }

    return paragraphs;
  }

  function createTimesSection(times: MedicalLegalReport['header']['times']): Paragraph[] {
    if (!times || !times.history || !times.physicalExam || !times.totalTime) {
      // Return empty array or default paragraphs if times data is missing
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Times not recorded',
              italics: true
            })
          ]
        })
      ];
    }

    return [
      new Paragraph({
        children: [
          new TextRun({
            text: `History: ${times.history.duration} (${times.history.timeRange})`,
            bold: true
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Physical Exam: ${times.physicalExam.duration} (${times.physicalExam.timeRange})`,
            bold: true
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Total Time in Office: ${times.totalTime.duration} (${times.totalTime.timeRange})`,
            bold: true
          })
        ]
      })
    ];
  }
  
  function createGeneralInfo(info: MedicalLegalReport['history']['generalInfo']): Paragraph[] {
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'General Information', bold: true })]
      }),
      ...Object.entries(info.demographics).map(([key, value]) =>
        new Paragraph({
          children: [
            new TextRun({ text: `${key}: `, bold: true }),
            new TextRun({ text: value })
          ]
        })
      ),
      new Paragraph({
        children: [
          new TextRun({ text: 'Identification: ', bold: true }),
          new TextRun({ text: info.identification })
        ]
      })
    ];
  }
  
  function createSymptoms(symptoms: MedicalLegalReport['history']['currentSymptoms']): Paragraph[] {
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Current Symptoms', bold: true })]
      }),
      ...symptoms.map(symptom => [
        new Paragraph({
          children: [new TextRun({ text: symptom.region, bold: true })]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Pain Level: ${symptom.pain.level}/10\n` }),
            new TextRun({ text: `Characteristics: ${symptom.pain.characteristics.join(', ')}\n` }),
            new TextRun({ text: `Frequency: ${symptom.pain.frequency}` })
          ]
        }),
        ...(symptom.pain.triggers ? [
          new Paragraph({
            children: [new TextRun({ text: `Triggers: ${symptom.pain.triggers.join(', ')}` })]
          })
        ] : []),
        new Paragraph({
          children: [new TextRun({ text: `Functional Impact: ${symptom.functionalImpact.join(', ')}` })]
        }),
        new Paragraph({
          children: [new TextRun({ text: `Treatments: ${symptom.treatments.join(', ')}` })]
        })
      ]).flat()
    ];
  }
  
  function createMedications(medications: MedicalLegalReport['history']['medications']): Paragraph[] {
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Medications', bold: true })]
      }),
      ...medications.map(med =>
        new Paragraph({
          children: [
            new TextRun({ text: `${med.name}: `, bold: true }),
            new TextRun({ text: `${med.dosage}, ${med.frequency}` }),
            ...(med.purpose ? [new TextRun({ text: ` (${med.purpose})` })] : [])
          ]
        })
      )
    ];
  }
  
  function createTreatmentHistory(history: MedicalLegalReport['history']['treatmentHistory']): Paragraph[] {
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Treatment History', bold: true })]
      }),
      ...history.currentProviders.map(provider =>
        new Paragraph({
          children: [
            new TextRun({ text: `${provider.name} (${provider.specialty}): `, bold: true }),
            new TextRun({ text: `Last visit: ${provider.lastVisit}` }),
            ...(provider.nextVisit ? [new TextRun({ text: `, Next visit: ${provider.nextVisit}` })] : [])
          ]
        })
      ),
      new Paragraph({
        children: [
          new TextRun({ text: 'Past Treatments: ', bold: true }),
          new TextRun({ text: history.pastTreatments.join(', ') })
        ]
      }),
      ...(history.plannedTreatments ? [
        new Paragraph({
          children: [
            new TextRun({ text: 'Planned Treatments: ', bold: true }),
            new TextRun({ text: history.plannedTreatments.join(', ') })
          ]
        })
      ] : [])
    ];
  }
  
  function createFunctionalAssessment(assessment: MedicalLegalReport['history']['functionalAssessment']): Paragraph[] {
    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'Functional Assessment', bold: true })]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Sleep Pattern: ', bold: true }),
          new TextRun({ text: assessment.sleep.pattern }),
          new TextRun({ text: '\nIssues: ', bold: true }),
          new TextRun({ text: assessment.sleep.issues.join(', ') }),
          ...(assessment.sleep.aids ? [
            new TextRun({ text: '\nAids: ', bold: true }),
            new TextRun({ text: assessment.sleep.aids.join(', ') })
          ] : [])
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Activities of Daily Living', bold: true })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Independent: ', bold: true }),
          new TextRun({ text: assessment.adl.independent.join(', ') })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Needs Assistance: ', bold: true }),
          new TextRun({ text: assessment.adl.needsAssistance.join(', ') })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Unable to Perform: ', bold: true }),
          new TextRun({ text: assessment.adl.unable.join(', ') })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Mobility: ', bold: true }),
          new TextRun({ text: assessment.mobility })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Work Status: ', bold: true }),
          new TextRun({ text: assessment.work })
        ]
      })
    ];
  }