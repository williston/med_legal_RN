'use client'

import { Caveat, Fredoka } from 'next/font/google'
import { Stethoscope, Mic, FileText, Brain } from 'lucide-react'

const caveat = Caveat({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })

export default function About() {
  return (
    <div className="min-h-screen bg-law-blue-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-law-blue-900">
              About Medical Legal Documentation Assistant
            </h1>
            <p className="text-lg text-neutral-600">
              Professional documentation solutions for healthcare and legal practitioners
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-law-blue-600" />}
              title="Voice-to-Text Documentation"
              description="Efficiently capture detailed observations with professional-grade voice recognition technology."
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-law-blue-600" />}
              title="AI-Enhanced Analysis"
              description="Advanced processing ensures comprehensive and structured legal documentation."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-law-blue-600" />}
              title="Professional Templates"
              description="Industry-standard formats designed for medical legal documentation requirements."
            />
            <FeatureCard
              icon={<Stethoscope className="w-8 h-8 text-law-blue-600" />}
              title="Healthcare Expertise"
              description="Tailored specifically for medical legal documentation needs and compliance standards."
            />
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-md shadow-sm border border-neutral-200 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-law-blue-900">Documentation Process</h2>
            <ol className="space-y-6">
              <ProcessStep
                number={1}
                title="Record Observations"
                description="Document clinical observations using our professional voice recorder or text input."
              />
              <ProcessStep
                number={2}
                title="AI-Powered Transcription"
                description="Advanced AI technology converts voice recordings into accurate, structured text."
              />
              <ProcessStep
                number={3}
                title="Professional Formatting"
                description="Content is automatically organized into a standardized medical legal format."
              />
              <ProcessStep
                number={4}
                title="Review and Export"
                description="Review, edit, and export your documentation in court-ready formats."
              />
            </ol>
          </div>

          {/* Professional Standards Section */}
          <div className="bg-law-blue-900 text-white rounded-md p-8">
            <h2 className="text-2xl font-bold mb-6">Professional Standards</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <StandardCard
                title="HIPAA Compliance"
                description="Secure, compliant documentation handling that meets healthcare privacy requirements."
              />
              <StandardCard
                title="Legal Requirements"
                description="Documentation formats that meet legal and regulatory standards."
              />
              <StandardCard
                title="Quality Assurance"
                description="Built-in verification processes ensure accuracy and completeness."
              />
              <StandardCard
                title="Data Security"
                description="Enterprise-grade security measures protect sensitive information."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-neutral-200 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-law-blue-50 rounded-md">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-law-blue-900 mb-2">{title}</h3>
          <p className="text-neutral-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

function ProcessStep({
  number,
  title,
  description
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <li className="flex items-start">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-law-blue-100 text-law-blue-700 font-semibold mr-4 flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-law-blue-800 mb-1">{title}</h3>
        <p className="text-neutral-600">{description}</p>
      </div>
    </li>
  )
}

function StandardCard({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-law-blue-800/50 p-6 rounded-md">
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-law-blue-100">{description}</p>
    </div>
  )
}