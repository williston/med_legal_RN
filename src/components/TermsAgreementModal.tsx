'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ExternalLink } from 'lucide-react'

const TERMS_VERSION = '1.0.0'
const TERMS_REACCEPT_DAYS = 90

export function TermsAgreementModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const agreedVersion = localStorage.getItem('termsVersion')
    const agreedDate = localStorage.getItem('termsAgreedDate')
    
    if (!agreedVersion || agreedVersion !== TERMS_VERSION) {
      setIsOpen(true)
      return
    }

    if (agreedDate) {
      const daysSinceAgreed = (Date.now() - new Date(agreedDate).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceAgreed > TERMS_REACCEPT_DAYS) {
        setIsOpen(true)
      }
    }
  }, [])

  const handleAgree = () => {
    localStorage.setItem('termsVersion', TERMS_VERSION)
    localStorage.setItem('termsAgreedDate', new Date().toISOString())
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 
              id="terms-modal-title"
              className="text-2xl font-bold text-law-blue-900"
            >
              Medical Legal Documentation Assistant Terms
            </h2>
            
            <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-800">
                Important: This is a professional training tool. Do not enter any real patient 
                or confidential information.
              </p>
            </div>
          </div>

          <div className="space-y-6 text-neutral-700">
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-law-blue-800">Purpose</h3>
              <p className="text-sm leading-relaxed">
                This application is designed to assist legal and medical professionals in creating
                structured documentation through AI-powered transcription and analysis, using only
                simulated or anonymized scenarios for training purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-law-blue-800">Key Agreements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-law-blue-600 flex-shrink-0" />
                  <span>I will not input any real patient or confidential information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-law-blue-600 flex-shrink-0" />
                  <span>I will use only simulated or properly anonymized scenarios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-law-blue-600 flex-shrink-0" />
                  <span>I understand this is a training and assistance tool, not for official documentation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-law-blue-600 flex-shrink-0" />
                  <span>I will comply with all applicable privacy and confidentiality requirements</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="space-y-4 pt-4">
            <Link 
              href="/terms"
              className="inline-flex items-center text-sm text-law-blue-600 hover:text-law-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Complete Terms of Use
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2.5 text-sm font-medium text-neutral-700 border border-neutral-300 
                         rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none 
                         focus:ring-2 focus:ring-law-blue-200"
              >
                Decline & Exit
              </button>
              <button
                onClick={handleAgree}
                className="px-4 py-2.5 text-sm font-medium text-white bg-law-blue-600 
                         rounded-lg hover:bg-law-blue-700 transition-colors focus:outline-none 
                         focus:ring-2 focus:ring-law-blue-200"
              >
                I Agree & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}