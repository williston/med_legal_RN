// lib/docx-generator.ts
import { 
    Document, 
    Paragraph, 
    TextRun, 
    HeadingLevel,
    Packer
  } from 'docx';

export function createDocument(data: any): Document {
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
        ...createHeader(data.header || {}),
        ...createTimeline(data.chronological_timeline || []),
        ...createHistory(data.history || {}),
        ...createPhysicalExam(data.physical_examination || {}),
        ...createAdditionalObservations(data.additional_observations || {}),
        ...createClosing(data.closing || '')
      ]
    }]
  });
}

function createHeader(header: any): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (header.examiner) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: `Examiner: ${header.examiner}`,
            bold: true
          })
        ]
      })
    );
  }

  if (header.observer) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Observer: ${header.observer}`,
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

  if (header.interpreter && header.interpreter !== 'Not applicable') {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Interpreter: ${header.interpreter}`,
            bold: true
          })
        ]
      })
    );
  }

  return paragraphs;
}

function createTimeline(timeline: any[]): Paragraph[] {
  if (!Array.isArray(timeline) || timeline.length === 0) return [];

  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Timeline', bold: true })]
    })
  ];

  timeline.forEach(entry => {
    if (entry?.time && entry?.event) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${entry.time} -- `, bold: true }),
            new TextRun({ text: entry.event })
          ]
        })
      );
    }
  });

  return paragraphs;
}

function createHistory(history: any): Paragraph[] {
  if (!history || Object.keys(history).length === 0) return [];

  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'History', bold: true })]
    })
  ];

  if (history.duration) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Duration: `, bold: true }),
          new TextRun({ text: history.duration })
        ]
      })
    );
  }

  // Add any other history sections that exist
  Object.entries(history).forEach(([key, value]) => {
    if (value && key !== 'duration') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${key}: `, bold: true }),
            new TextRun({ text: String(value) })
          ]
        })
      );
    }
  });

  return paragraphs;
}

function createPhysicalExam(exam: any): Paragraph[] {
  if (!exam || Object.keys(exam).length === 0) return [];

  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Physical Examination', bold: true })]
    })
  ];

  if (exam.details_not_provided) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: 'Details not provided in transcript',
            italics: true
          })
        ]
      })
    );
  }

  // Add any other exam details that exist
  Object.entries(exam).forEach(([key, value]) => {
    if (value && key !== 'details_not_provided') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${key}: `, bold: true }),
            new TextRun({ text: String(value) })
          ]
        })
      );
    }
  });

  return paragraphs;
}

function createAdditionalObservations(observations: any): Paragraph[] {
  if (!observations || Object.keys(observations).length === 0) return [];

  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Additional Observations', bold: true })]
    })
  ];

  if (observations.documents_mentioned?.length) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: 'Documents Mentioned:', bold: true })]
      })
    );

    observations.documents_mentioned.forEach((doc: string) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${doc}` })]
        })
      );
    });
  }

  // Add any other observations that exist
  Object.entries(observations).forEach(([key, value]) => {
    if (value && key !== 'documents_mentioned') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${key}: `, bold: true }),
            new TextRun({ text: String(value) })
          ]
        })
      );
    }
  });

  return paragraphs;
}

function createClosing(closing: any): Paragraph[] {
  if (!closing) return [];

  // Handle closing as either a string or an object
  if (typeof closing === 'string') {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: closing,
            italics: true
          })
        ]
      })
    ];
  }

  const paragraphs: Paragraph[] = [];

  if (closing.text) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: closing.text,
            bold: true
          })
        ]
      })
    );
  }

  if (closing.execution_date && closing.execution_location) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Executed on ${closing.execution_date}, at ${closing.execution_location}`
          })
        ]
      })
    );
  }

  if (closing.name_and_credentials) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: closing.name_and_credentials
          })
        ]
      })
    );
  }

  return paragraphs;
}