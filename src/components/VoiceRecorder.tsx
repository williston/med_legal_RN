"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Mic, Square, Pause, Play, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { compressAudioFile } from '@/lib/audio-compression'

interface VoiceRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
}

export function VoiceRecorder({ onAudioRecorded, onRecordingStart }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timer, setTimer] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingState, setProcessingState] = useState<'idle' | 'compressing' | 'transcribing'>('idle');
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const ACCEPTED_TYPES = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/webm'];
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload an audio file (MP3, WAV, or WebM)';
    }
    if (file.size > 25 * 1024 * 1024) {
      return 'File too large. It will be compressed automatically';
    }
    return null;
  };

  const startRecording = useCallback(async () => {
    try {
      onRecordingStart?.();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let mimeType;

      if (isIOS) {
        if (MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')) {
          mimeType = 'audio/mp4;codecs=mp4a.40.2';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = 'audio/mp4';
        }
      } else {
        mimeType = 'audio/webm';
      }

      console.log('Using MIME type:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Create a named file with explicit mp4 extension for iOS
        const fileName = isIOS ? 'recording.mp4' : 'recording.webm';
        const file = new File([finalBlob], fileName, {
          type: mimeType,
          lastModified: Date.now()
        });
        
        console.log('Created file:', { name: file.name, type: file.type, size: file.size });
        onAudioRecorded(file);
      };

      mediaRecorder.start(1000); // Smaller chunks for iOS
      setIsRecording(true);
      setIsPaused(false);
    } catch (error: unknown) {
      console.error('Recording error:', error);
      alert('Recording error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [onAudioRecorded, onRecordingStart]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }, [])
 
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      setTimer(0)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const togglePause = () => {
    if (isPaused) {
      resumeRecording()
    } else {
      pauseRecording()
    }
  }

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const MAX_RECORDING_TIME = 600 // 10 minutes in seconds

  useEffect(() => {
    if (timer >= MAX_RECORDING_TIME) {
      stopRecording()
      toast.error('Maximum recording time reached')
    }
  }, [timer, stopRecording])

  const calculateEstimatedTime = (fileSize: number) => {
    const estimatedSeconds = Math.ceil(fileSize / (1024 * 1024) * 2);
    setEstimatedTime(estimatedSeconds);
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
    }

    setSelectedFile(file);
    calculateEstimatedTime(file.size);

    try {
      let processedFile = file;
      
      if (file.size > 25 * 1024 * 1024) {
        setProcessingState('compressing');
        toast.loading('Compressing audio file...');
        processedFile = await compressAudioFile(
          file, 
          { quality: 'minimum' },
          (progress) => setCompressionProgress(progress)
        );
      }

      setProcessingState('transcribing');
      await onAudioRecorded(processedFile);
      toast.success('Processing complete!');
    } catch (error) {
      console.error('File processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process audio file');
    } finally {
      setProcessingState('idle');
      setCompressionProgress(0);
      event.target.value = '';
      setEstimatedTime(0);
    }
  }, [onAudioRecorded]);

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2">Recording Requirements</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Supported formats: MP3, WAV, WebM</li>
          <li>• Maximum file size: 25MB</li>
          <li>• Files over 25MB will be automatically compressed</li>
          {selectedFile && (
            <li className="text-blue-600">
              Selected file: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
            </li>
          )}
        </ul>
      </div>
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-800">Important Notice</h3>
        <p className="text-sm text-yellow-700">
          This tool is for professional documentation purposes. 
          DO NOT include any protected health information (PHI):
          • No patient names, ages, or dates of birth
          • No room numbers or locations
          • No specific medical record details
          • No unique identifying characteristics
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4 p-6 bg-blue-50 rounded-lg shadow-md">
        {isRecording && (
          <div className="text-3xl font-bold text-teal-600" aria-live="polite">
            {formatTime(timer)}
          </div>
        )}
        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleRecording}
            className={cn(
              "w-16 h-16 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-300" 
                : "bg-teal-500 hover:bg-teal-600 focus:ring-teal-300",
              "transition-all duration-300 ease-in-out transform hover:scale-105",
              "rounded-tl-2xl rounded-br-2xl shadow-lg",
              "border-4 border-white"
            )}
            aria-label={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          <span className="text-lg font-medium text-teal-700">
            {isRecording ? "End" : "Start"}
          </span>

          {isRecording && (
            <button 
              onClick={togglePause}
              className={cn(
                "w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300",
                "bg-blue-400 hover:bg-blue-500",
                "transition-all duration-300 ease-in-out transform hover:scale-105",
                "rounded-full shadow-lg",
                "border-4 border-white"
              )}
              disabled={!isRecording}
              aria-label={isPaused ? "Resume Recording" : "Pause Recording"}
            >
              {isPaused ? (
                <Play className="w-6 h-6 text-white" />
              ) : (
                <Pause className="w-6 h-6 text-white" />
              )}
            </button>
          )}

          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
              disabled={isProcessing}
            />
            {isProcessing && (
              <div className="text-sm text-gray-600">
                Processing audio file...
              </div>
            )}
            <label
              htmlFor="audio-upload"
              className={cn(
                "w-12 h-12 flex items-center justify-center cursor-pointer",
                "bg-teal-500 hover:bg-teal-600",
                "transition-all duration-300 ease-in-out transform hover:scale-105",
                "rounded-full shadow-lg",
                "border-4 border-white",
                "focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-teal-300"
              )}
            >
              <Upload className="w-6 h-6 text-white" />
            </label>
          </div>
        </div>
      </div>
      {processingState !== 'idle' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
            <span className="text-blue-700">
              {processingState === 'compressing' ? (
                <>
                  Compressing audio ({compressionProgress.toFixed(0)}%)
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${compressionProgress}%` }} 
                    />
                  </div>
                </>
              ) : (
                'Transcribing audio...'
              )}
            </span>
          </div>
          {estimatedTime > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              Estimated time remaining: ~{estimatedTime} seconds
            </div>
          )}
        </div>
      )}
      
      {/* File size warning */}
      <div className="text-sm text-gray-600 mt-2">
        Maximum file size: 25MB
        {selectedFile && (
          <span className="ml-2">
            (Current: {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
          </span>
        )}
      </div>
    </div>
  )
}