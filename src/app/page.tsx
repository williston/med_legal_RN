'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import { Wand2 } from 'lucide-react'
import { VoiceRecorder } from '../components/VoiceRecorder'
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay'
//import { TemplateSelector } from '@/components/TemplateSelector'
import { useUser } from '@clerk/nextjs'
import { Caveat, Fredoka } from 'next/font/google'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { saveAs } from 'file-saver'
const caveat = Caveat({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })

interface FileHistory {
  name: string;
  timestamp: string;
  status: 'completed' | 'failed';
}

export default function Home() {
  const { user } = useUser()
  const router = useRouter()
  const [transcription, setTranscription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [fileHistory, setFileHistory] = useState<FileHistory[]>([]);

  const handleAudioRecorded = useCallback(async (audioBlob: Blob, fileName?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const displayName = fileName || `Recording ${timestamp}`;
    
    setFileHistory(prev => [...prev, {
      name: displayName,
      timestamp,
      status: 'completed'
    }]);

    console.log('handleAudioRecorded called with:', {
      type: audioBlob.type,
      size: audioBlob.size
    });

    const formData = new FormData();
    
    // Determine file extension based on MIME type
    const fileExtension = audioBlob.type.includes('mp4') ? '.mp4' : 
                         audioBlob.type.includes('mpeg') ? '.mp3' : 
                         audioBlob.type.includes('wav') ? '.wav' : '.webm';
    
    formData.append('file', audioBlob, `audio${fileExtension}`);
  
    try {
      console.log('Sending request to /api/transcribe');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Transcription failed:', data);
        toast.error(`Transcription failed: ${data.details?.message || 'Unknown error'}`);
        return;
      }
  
      console.log('Transcription successful:', data);
      setTranscription((prevTranscription) => prevTranscription + '\n' + data.transcription);
      toast.success('Audio transcribed successfully');
      
      setFileHistory(prev => prev.map(file => 
        file.name === displayName 
          ? { ...file, status: 'completed' }
          : file
      ));
    } catch (error) {
      setFileHistory(prev => prev.map(file => 
        file.name === displayName 
          ? { ...file, status: 'failed' }
          : file
      ));
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio')
    }
  }, []);

  const handleTranscriptionChange = useCallback((newTranscription: string) => {
    setTranscription(newTranscription)
  }, [])

  /* const handleTemplateSelect = useCallback((templateId: number) => {
    setSelectedTemplate(templateId)
  }, []) */

  const handleRecordingStart = useCallback(() => {
    setTranscription(''); // Clear the transcription when recording starts
  }, []);

  const handleAnalyzeTranscription = useCallback(async () => {
    if (!transcription) {
      toast.error('Please provide a transcription first');
      return;
    }

    setIsAnalyzing(true);

    try {
      const docResponse = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcription,
        }),
      });

      if (!docResponse.ok) {
        const errorData = await docResponse.json();
        throw new Error(errorData.details || 'Failed to generate report');
      }

      const blob = await docResponse.blob();
      saveAs(blob, 'medical-legal-report.docx');
      toast.success('Report generated successfully');
      
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate report');
    } finally {
      setIsAnalyzing(false);
    }
  }, [transcription]);



  return (
    <div className={`min-h-screen flex flex-col bg-law-blue-50 ${fredoka.className}`}>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative mb-6">
            {user && (
              <>
                <h2 className="text-2xl text-law-blue-700 text-center font-semibold">
                  Welcome, {user.firstName || user.username || 'there'}
                </h2>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-6 text-law-blue-900 text-center">
            Medical Legal Documentation Assistant
          </h1>
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <p className="text-neutral-700 text-lg mb-6 leading-relaxed">
              Create professional medical legal documentation efficiently. 
              Record or type your observations and let AI help structure your report.
            </p>
            
            <VoiceRecorder 
              onAudioRecorded={handleAudioRecorded}
              onRecordingStart={handleRecordingStart}
            />
            
            <TranscriptionDisplay 
              transcription={transcription}
              onTranscriptionChange={handleTranscriptionChange}
            />
            
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleAnalyzeTranscription}
                className={`px-6 py-3 rounded-md flex items-center justify-center transition-all duration-300 
                  ${!isAnalyzing
                    ? 'bg-law-blue-700 text-white hover:bg-law-blue-800 focus:ring-2 focus:ring-law-blue-300 focus:ring-offset-2' 
                    : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Generate Legal Report
                  </>
                )}
              </button>
            </div>
            
            {fileHistory.length > 0 && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-md">
                <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                  Processed Files:
                </h3>
                <ul className="space-y-1">
                  {fileHistory.map((file, index) => (
                    <li 
                      key={`${file.name}-${index}`}
                      className="text-sm flex items-center justify-between"
                    >
                      <span className="text-neutral-600">
                        {file.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        file.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {file.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
