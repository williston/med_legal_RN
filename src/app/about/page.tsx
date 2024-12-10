'use client'

import { Caveat, Fredoka } from 'next/font/google'
import { Stethoscope, Mic, FileText, Brain } from 'lucide-react'

const caveat = Caveat({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })

export default function About() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 ${fredoka.className}`}>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className={`text-4xl md:text-5xl font-bold text-teal-700 ${caveat.className}`}>
              About Medical Legal Documentation Assistant
            </h1>
            <p className="text-lg text-gray-600">
              Converting clinical observations into comprehensive medical legal documentation
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-teal-500" />}
              title="Voice-First Documentation"
              description="Record your observations naturally, saving valuable time during assessments."
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-teal-500" />}
              title="AI-Powered Analysis"
              description="Advanced AI technology structures your recordings into comprehensive legal documentation."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-teal-500" />}
              title="Professional Templates"
              description="Support for various medical legal documentation formats and requirements."
            />
            <FeatureCard
              icon={<Stethoscope className="w-8 h-8 text-teal-500" />}
              title="Healthcare Focused"
              description="Designed specifically for medical legal documentation needs."
            />
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <h2 className="text-2xl font-bold text-teal-700">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 mr-4">1</span>
                <p>Record your clinical observations using the voice recorder</p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 mr-4">2</span>
                <p>Review and edit the AI-generated transcription</p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 mr-4">3</span>
                <p>Generate a structured medical legal report</p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 mr-4">4</span>
                <p>Download and use your professional documentation</p>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="flex items-center space-x-4 mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-teal-700">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-teal-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-teal-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}