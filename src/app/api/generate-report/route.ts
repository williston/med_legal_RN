// app/api/generate-report/route.ts
import { NextResponse } from 'next/server';
import { generateReportContent } from '../../../lib/openai';
import { createDocument } from '../../../lib/docx-generator';
import { Packer } from 'docx';

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Valid transcript text is required' },
        { status: 400 }
      );
    }

    // Generate report content using OpenAI
    const reportData = await generateReportContent(transcript);
    
    // Debug log to see the structure
    console.log('OpenAI Response:', JSON.stringify(reportData, null, 2));

    // Validate report structure with more specific error
    if (!reportData) {
      throw new Error('No report data received from AI');
    }
    if (!reportData.header) {
      throw new Error('Report missing header section');
    }
    if (!reportData.header.examiner) {
      throw new Error('Report missing examiner information');
    }

    // Create Word document
    const doc = createDocument(reportData);

    // Convert to buffer
    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=medical-legal-report.docx'
      },
    });

  } catch (error: unknown) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Error generating report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}