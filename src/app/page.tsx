// pages/index.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import { Wand2 } from 'lucide-react'
import { VoiceRecorder } from '../components/VoiceRecorder'
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay'
import { TemplateSelector } from '@/components/TemplateSelector'
import { useUser } from '@clerk/nextjs'
import { Caveat, Fredoka } from 'next/font/google'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const caveat = Caveat({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })

export default function Home() {
  const { user } = useUser()
  const router = useRouter()
  const [transcription, setTranscription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAudioRecorded = useCallback(async (audioBlob: Blob) => {
    const formData = new FormData();
    console.log('Sending audio blob type:', audioBlob.type);
    console.log('Sending audio blob size:', audioBlob.size);
    
    formData.append('file', audioBlob, audioBlob.type.includes('mp4') ? 'audio.mp4' : 'audio.webm');
  
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Transcription failed:', data);
        alert(`Transcription failed: ${data.details?.message || 'Unknown error'}`);
        return;
      }
  
      console.log('Transcription successful:', data);
      setTranscription(data.transcription);
    } catch (error) {
      toast.error('Failed to transcribe audio')
    }
  }, []);

  const handleTranscriptionChange = useCallback((newTranscription: string) => {
    setTranscription(newTranscription)
  }, [])

  const handleTemplateSelect = useCallback((templateId: number) => {
    setSelectedTemplate(templateId)
  }, [])

  const handleRecordingStart = useCallback(() => {
    setTranscription(''); // Clear the transcription when recording starts
  }, []);

  const handleAnalyzeTranscription = useCallback(async () => {
    if (!transcription || selectedTemplate !== 1) return

    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: transcription,
          formType: 'nurseForm1'
        }),
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      
      const storeResponse = await fetch('/api/store-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: data,
          template: selectedTemplate
        }),
      })

      if (!storeResponse.ok) throw new Error('Failed to store form data')

      const { id } = await storeResponse.json()

      router.push(`/populated-form/${id}`)
    } catch (error) {
      console.error('Content generation error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [transcription, selectedTemplate, router])



  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-teal-50 ${fredoka.className}`}>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative mb-4">
            {user && (
              <>
                <h2 className={`text-3xl text-teal-600 text-center ${caveat.className} animate-fade-in-down`}>
                  Hi, {user.firstName || user.username || 'there'}!
                </h2>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <Link 
                    href="https://www.med.unc.edu/medclerk/education/grading/history-and-physical-examination-h-p-examples/"
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="text-blue-800 hover:text-blue-600 underline text-base font-medium"
                  >
                    Practice Data →
                  </Link>
                </div>
              </>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-8 text-teal-700 text-center animate-fade-in-up">SBAR Practice & Learning Tool</h1>
          <p className="text-gray-600">
            Practice structured clinical communication using simulated scenarios. 
            Perfect your SBAR technique without using real patient information.
          </p>
          <div className="space-y-8">
            <VoiceRecorder 
              onAudioRecorded={handleAudioRecorded}
              onRecordingStart={handleRecordingStart}
            />
            <TranscriptionDisplay 
              transcription={transcription}
              onTranscriptionChange={handleTranscriptionChange}
            />
            <TemplateSelector 
              onTemplateSelect={handleTemplateSelect}
            />
            <div className="flex justify-center">
              <button 
                onClick={handleAnalyzeTranscription}
                className={`px-6 py-3 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                  selectedTemplate === 1 && !isAnalyzing
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-teal-500 hover:to-blue-600 focus:ring-teal-300' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedTemplate !== 1 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : selectedTemplate !== 1 ? (
                  <>
                    <Wand2 className="mr-2 animate-pulse" />
                    Analyze Transcription
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 animate-pulse" />
                    Analyze Transcription
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
