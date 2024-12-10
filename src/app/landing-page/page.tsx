'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Caveat, Fredoka } from 'next/font/google'
import { 
  Clock, 
  Shield, 
  CheckCircle2, 
  FileText, 
  Brain 
} from 'lucide-react'
import { SignInButton } from "@clerk/nextjs"
import Image from 'next/image'

const caveat = Caveat({ subsets: ['latin'] })
const fredoka = Fredoka({ subsets: ['latin'] })

export default function Landing() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  return (
    <div className="min-h-screen bg-law-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-law-blue-900 leading-tight">
              Professional Medical Legal Documentation
              <span className="block text-law-blue-700 mt-2">
                Simplified
              </span>
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Transform clinical observations into comprehensive medical legal reports with precision and efficiency. Built for healthcare professionals and legal practitioners.
            </p>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <button className="px-6 py-3 bg-law-blue-700 text-white rounded-md font-medium text-lg hover:bg-law-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-law-blue-300 focus:ring-offset-2">
                  Start Professional Trial
                </button>
              </SignInButton>
              <button 
                onClick={() => router.push('/about')}
                className="px-6 py-3 border-2 border-law-blue-300 text-law-blue-700 rounded-md font-medium text-lg hover:bg-law-blue-50 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-8 text-neutral-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>HIPAA Compliance pending</span> {/* HIPAA Compliant  */}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Professional Standards</span>
              </div>
            </div>
          </div>
          
          {/* Product Preview */}
          <div className="relative">
            <div className="bg-white rounded-md shadow-lg p-6 border border-neutral-200">
              <Image 
                src=''
                alt="Medical Legal Documentation Interface"
                width={600}
                height={400}
                className="rounded-md"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-y border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-bold text-law-blue-900">
              Professional Documentation Solutions
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Clock />}
                title="Efficient Documentation"
                description="Streamline the creation of detailed medical legal reports"
              />
              <FeatureCard 
                icon={<FileText />}
                title="Professional Format"
                description="Generate standardized, court-ready documentation"
              />
              <FeatureCard 
                icon={<Brain />}
                title="AI-Enhanced Analysis"
                description="Ensure comprehensive coverage of critical details"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-law-blue-900 mb-12">
              Trusted by Legal and Healthcare Professionals
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard 
                quote="This platform has significantly improved the quality and consistency of our medical legal documentation."
                author="Dr. Sarah K."
                role="Medical Legal Expert"
              />
              <TestimonialCard 
                quote="The structured format and professional output have made our documentation process much more efficient."
                author="Michael R."
                role="Healthcare Attorney"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-law-blue-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">Join Our Professional Network</h2>
            <p className="text-xl text-law-blue-100">
              Ideal for medical practices, legal firms, and healthcare organizations requiring professional documentation solutions.
            </p>
            <form className="flex gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email"
                placeholder="Enter your professional email"
                className="flex-1 px-4 py-3 rounded-md text-neutral-900 border border-law-blue-300 focus:ring-2 focus:ring-law-blue-300 focus:border-law-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-law-blue-700 rounded-md font-medium hover:bg-law-blue-50 transition-colors"
              >
                Request Access
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-neutral-600 text-sm">
              © 2024 MedLegal Scribe. All rights reserved.
            </div>
            <div className="flex gap-8 text-neutral-600">
              <a href="/privacy" className="hover:text-law-blue-700 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-law-blue-700 transition-colors">Terms of Service</a>
              <a href="/contact" className="hover:text-law-blue-700 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) {
  return (
    <div className="text-center space-y-4 p-6 bg-law-blue-50 rounded-md border border-law-blue-100">
      <div className="w-12 h-12 mx-auto text-law-blue-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-xl text-law-blue-900">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: {
  quote: string,
  author: string,
  role: string
}) {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-neutral-200">
      <p className="text-neutral-600 mb-4">&ldquo;{quote}&rdquo;</p>
      <div>
        <div className="font-semibold text-law-blue-800">{author}</div>
        <div className="text-sm text-neutral-500">{role}</div>
      </div>
    </div>
  )
}





/* This landing page:

1. Has a clear value proposition focused on saving nurses' time with voice-based documentation

2. Includes multiple CTAs:
   - Primary: "Start Free Trial" (using Clerk auth)
   - Secondary: "Learn More" and waitlist signup

3. Shows the problem/solution through three key benefits:
   - Time savings
   - Structured format
   - AI accuracy

4. Incorporates social proof through nurse testimonials

5. Features a lead capture form in the early access section

6. Includes a product preview image (you'll need to add this)

7. Shows trust indicators:
   - HIPAA compliance badge
   - Uptime guarantee
   - Privacy policy/terms links

8. Uses urgency through the early access program offer

9. Maintains the app's existing design language:
   - Same fonts (Fredoka/Caveat)
   - Consistent color scheme
   - Similar UI components

Note: You'll need to:
1. Add an actual product preview image
2. Set up the waitlist form functionality
3. Create privacy/terms/contact pages
4. Add actual testimonials when available
5. Verify HIPAA compliance before claiming it */