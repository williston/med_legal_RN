'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'

const feedbackSchema = z.object({
  message: z.string().min(10, 'Feedback must be at least 10 characters'),
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema)
  })

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Feedback User',
          email: 'feedback@medlegalscribe.com',
          subject: 'Professional Feedback Submission',
          message: data.message,
          department: 'feedback'
        }),
      })

      if (!response.ok) throw new Error('Failed to send feedback')

      setSubmitStatus('success')
      reset()
      setTimeout(() => {
        onOpenChange(false)
        setSubmitStatus(null)
      }, 2000)
    } catch (error) {
      console.error('Feedback form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white p-6">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 text-law-blue-800">
            <MessageSquare className="w-5 h-5" />
            <DialogTitle className="text-xl font-semibold">Professional Feedback</DialogTitle>
          </div>
          <DialogDescription className="text-neutral-600">
            Share your thoughts to help us improve our medical legal documentation services.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-law-blue-700 bg-law-blue-50 p-4 rounded-md border border-law-blue-200">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Thank you for your valuable feedback.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-4 rounded-md border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>An error occurred. Please try again later.</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              Your Feedback
            </label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full rounded-md border border-neutral-200 px-4 py-3 
                text-neutral-800 placeholder:text-neutral-400
                focus:outline-none focus:ring-2 focus:ring-law-blue-200 focus:border-law-blue-300
                transition-all duration-200"
              placeholder="Share your experience or suggestions for improvement..."
            />
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 rounded-md font-medium text-white 
                ${isSubmitting 
                  ? 'bg-neutral-400 cursor-not-allowed' 
                  : 'bg-law-blue-700 hover:bg-law-blue-800'
                } transition-colors duration-200 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}