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
    const children: Paragraph[] = [];

    // Only add sections if they contain data
    if (data.header) {
      children.push(...createHeader(data.header));
    }

    if (data.chronological_timeline && data.chronological_timeline.length > 0) {
      children.push(...createTimeline(data.chronological_timeline));
    }

    if (data.history_section) {
      children.push(...createHistory(data.history_section));
    }

    if (data.physical_examination && data.physical_examination.length > 0) {
      children.push(...createPhysicalExam(data.physical_examination));
    }

    if (data.measurements) {
      children.push(...createMeasurements(data.measurements));
    }

    if (data.additional_observations) {
      children.push(...createAdditionalObservations(data.additional_observations));
    }

    if (data.closing) {
      children.push(...createClosing(data.closing));
    }

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
        children
      }]
    });
  }
  
  function createHeader(header?: MedicalLegalReport['header']): Paragraph[] {
    if (!header) {
        return [];
    }

    const paragraphs: Paragraph[] = [];

    if (header.examiner) {
        paragraphs.push(
            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun({ text: `Examiner: ${header.examiner}`, bold: true })],
            })
        );
    }

    if (header.observer) {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: header.observer, bold: true })],
            })
        );
    }

    if (header.specialty) {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text: header.specialty, bold: true })],
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

     // Explicitly type check for times property
    /*  if (header.times) {
        const timesSection = createTimesSection(header.times);
        paragraphs.push(...timesSection);
    } */

    if (header.audio_recording_status) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: header.audio_recording_status,
                        italics: true
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
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Timeline', bold: true })]
      })
    ];

    timeline?.forEach(entry => {
      if (entry.time || entry.event) {
        paragraphs.push(
          new Paragraph({
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
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'History', bold: true })]
      })
    ];

    if (historySection?.general_information) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'General Information', bold: true })]
        })
      );

      const generalInfo = historySection.general_information;
      
      if (generalInfo.demographics) {
        paragraphs.push(
          new Paragraph({
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
            children: [
              new TextRun({ text: 'Hand Dominance: ', bold: true }),
              new TextRun({ text: generalInfo.hand_dominance })
            ]
          })
        );
      }
      if (generalInfo.id_verification) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'ID Verification: ', bold: true }),
              new TextRun({ text: generalInfo.id_verification })
            ]
          })
        );
      }
    }

    if (historySection?.current_symptoms && historySection.current_symptoms.length > 0) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Current Symptoms', bold: true })]
        })
      );

      historySection.current_symptoms.forEach(symptom => {
        if (symptom.body_region) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: symptom.body_region, bold: true })]
            })
          );
        }
        if (symptom.pain_level !== undefined) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Pain Level: ${symptom.pain_level}/10` })]
            })
          );
        }
        if (symptom.characteristics) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Characteristics: ${symptom.characteristics}` })]
            })
          );
        }
        if (symptom.frequency) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Frequency: ${symptom.frequency}` })]
            })
          );
        }
        if (symptom.duration) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Duration: ${symptom.duration}` })]
            })
          );
        }
        if (symptom.triggers && symptom.triggers.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Triggers: ${symptom.triggers.join(', ')}` })]
            })
          );
        }
        if (symptom.associated_symptoms && symptom.associated_symptoms.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Associated Symptoms: ${symptom.associated_symptoms.join(', ')}` })]
            })
          );
        }
        if (symptom.treatments && symptom.treatments.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Treatments: ${symptom.treatments.join(', ')}` })]
            })
          );
        }
        if (symptom.daily_impact && symptom.daily_impact.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `Daily Impact: ${symptom.daily_impact.join(', ')}` })]
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
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Physical Examination', bold: true })]
      })
    ];

    exam?.forEach(section => {
      if (section.body_region) {
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: section.body_region, bold: true })]
          })
        );
      }

      if (section.starting_position) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Starting Position: ', bold: true }),
              new TextRun({ text: section.starting_position })
            ]
          })
        );
      }

      if (section.tests && section.tests.length > 0) {
        section.tests.forEach(test => {
          paragraphs.push(
            new Paragraph({
              children: [
                ...(test.name ? [new TextRun({ text: `${test.name}: `, bold: true })] : []),
                ...(test.instructions ? [new TextRun({ text: `${test.instructions} ` })] : []),
                ...(test.performance ? [new TextRun({ text: test.performance })] : []),
                ...(test.pain_response ? [new TextRun({ text: ` (Pain: ${test.pain_response})` })] : [])
              ]
            })
          );
        });
      }
    });

    return paragraphs;
  }
  
  function createMeasurements(measurements: MedicalLegalReport['measurements']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Measurements', bold: true })]
      })
    ];

    if (measurements?.grip_strength) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Grip Strength', bold: true })]
        })
      );

      if (measurements.grip_strength.left && measurements.grip_strength.left.length > 0) {
        paragraphs.push(
          new Paragraph({
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
            children: [
              new TextRun({ text: 'Right: ', bold: true }),
              new TextRun({ text: measurements.grip_strength.right.join(', ') })
            ]
          })
        );
      }
    }

    // Add other measurement sections as needed
    return paragraphs;
  }
  
  function createAdditionalObservations(observations: MedicalLegalReport['additional_observations']): Paragraph[] {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: 'Additional Observations', bold: true })]
      })
    ];

    if (observations?.measurement_notes && observations.measurement_notes.length > 0) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Measurement Notes', bold: true })]
        }),
        ...observations.measurement_notes.map(note =>
          new Paragraph({
            children: [new TextRun({ text: `• ${note}` })]
          })
        )
      );
    }

    if (observations?.limitations && observations.limitations.length > 0) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Limitations', bold: true })]
        }),
        ...observations.limitations.map(limitation =>
          new Paragraph({
            children: [new TextRun({ text: `• ${limitation}` })]
          })
        )
      );
    }

    // Add other observation sections as needed
    return paragraphs;
  }
  
  function createClosing(closing: MedicalLegalReport['closing']): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    if (closing?.attestation) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: closing.attestation,
              bold: true
            })
          ]
        })
      );
    }

    if (closing?.execution_date || closing?.execution_location) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Executed on ${closing.execution_date ?? '[Date]'}, at ${closing.execution_location ?? '[Location]'}`
            })
          ]
        })
      );
    }

    if (closing?.examiner_signature) {
      const signature = closing.examiner_signature;
      const nameAndCredentials = `${signature.name ?? ''}${signature.credentials ? `, ${signature.credentials}` : ''}`;
      if (nameAndCredentials.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: nameAndCredentials,
              })
            ]
          })
        );
      }
    }

    return paragraphs;
  }
  
 //@ts-expect-error
  function createTimesSection(times: NonNullable<MedicalLegalReport['header']['times']>): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    if (times?.history) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `History: ${times.history.duration ?? ''} (${times.history.timeRange ?? ''})`,
                        bold: true
                    })
                ]
            })
        );
    }

    if (times?.physical_exam) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Physical Exam: ${times.physical_exam.duration ?? ''} (${times.physical_exam.timeRange ?? ''})`,
                        bold: true
                    })
                ]
            })
        );
    }

    if (times?.total_time) {
        paragraphs.push(
            new Paragraph({
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