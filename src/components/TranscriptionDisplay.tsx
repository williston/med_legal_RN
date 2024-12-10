import { Textarea } from '@/components/ui/textarea'
import { FileText, X, InfoIcon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface TranscriptionDisplayProps {
  transcription: string;
  onTranscriptionChange: (transcription: string) => void;
}

export function TranscriptionDisplay({ transcription, onTranscriptionChange }: TranscriptionDisplayProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const helpText = {
    recording: 'Click to start recording your medical legal observations',
    analysis: 'AI will structure your recording into a professional report format'
  }

  const handleMouseEnter = () => {
    if (!hasShown) {
      setShowPopup(true);
      setHasShown(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        handleClosePopup();
      }, 5000);
    }
  };

  const handleClosePopup = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsExiting(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-law-blue-50 rounded-lg p-6 mt-6">
      <div className="relative">
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-law-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-law-blue-800">
            Legal Documentation
          </h2>
        </div>

        {showPopup && (
          <div className={`absolute top-full left-0 mt-2 bg-white rounded-md shadow-xl 
            border border-law-blue-200 w-80 z-50 transition-all duration-300 ease-in-out ${
              isExiting 
                ? 'opacity-0 transform -translate-y-2' 
                : 'opacity-100 transform translate-y-0'
            }`}>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-law-blue-800 mb-2">
                Documentation Guidelines
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Focus on objective findings and relevant details for legal documentation.
                Maintain professional terminology and clarity.
              </p>
            </div>
          </div>
        )}
      </div>

      <Textarea
        value={transcription}
        onChange={(e) => onTranscriptionChange(e.target.value)}
        className="w-full min-h-[12rem] p-4 border border-law-blue-200 rounded-md
          font-serif text-lg text-neutral-800 bg-white shadow-sm
          focus:ring-2 focus:ring-law-blue-300 focus:border-law-blue-300
          transition-all duration-300 ease-in-out"
        placeholder="Enter your medical legal documentation here..."
      />
    </div>
  )
}