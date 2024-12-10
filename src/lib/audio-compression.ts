import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface CompressionOptions {
    quality: 'high' | 'medium' | 'low' | 'minimum';
    sampleRate?: number;
  }
  
  const COMPRESSION_PROFILES = {
    high: { bitrate: '128k', sampleRate: 44100 },    // Good quality, ~1MB/min
    medium: { bitrate: '96k', sampleRate: 32000 },   // OK quality, ~0.7MB/min
    low: { bitrate: '64k', sampleRate: 24000 },      // Basic quality, ~0.5MB/min
    minimum: { bitrate: '32k', sampleRate: 16000 }   // Minimum quality, ~0.25MB/min
  };
  
  export const compressAudioFile = async(
    file: File, 
    options: CompressionOptions = { quality: 'minimum' }
  ): Promise<File> => {
    const ffmpeg = new FFmpeg();
    const profile = COMPRESSION_PROFILES[options.quality];
  
    console.log('Starting compression with settings:', {
      quality: options.quality,
      bitrate: profile.bitrate,
      sampleRate: profile.sampleRate
    });
  
    try {
      // Load FFmpeg with proper paths
      console.log('Loading FFmpeg...');
      await ffmpeg.load({
        coreURL: await toBlobURL('/ffmpeg-core.js', 'text/javascript'),
        wasmURL: await toBlobURL('/ffmpeg-core.wasm', 'application/wasm'),
      });
      console.log('FFmpeg loaded successfully');
  
      console.log('Writing input file...');
      await ffmpeg.writeFile('input', await fetchFile(file));
      console.log('Input file written successfully');
  
      // Add progress logging
      ffmpeg.on('progress', ({ progress }) => {
        console.log(`Compression progress: ${(progress * 100).toFixed(2)}%`);
      });
  
      console.log('Starting compression...');
      await ffmpeg.exec([
        '-i', 'input',
        '-c:a', 'libmp3lame',
        '-b:a', profile.bitrate,
        '-ar', profile.sampleRate.toString(),
        '-ac', '1',  // Convert to mono if size is critical
        'output.mp3'
      ]);
      console.log('Compression completed');
  
      const data = await ffmpeg.readFile('output.mp3');
      const compressedBlob = new Blob([data], { type: 'audio/mp3' });
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'audio/mp3',
        lastModified: Date.now()
      });
      
      console.log('Compression results:', {
        originalSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        compressedSize: `${(compressedBlob.size / (1024 * 1024)).toFixed(2)} MB`,
        compressionRatio: `${((1 - (compressedBlob.size / file.size)) * 100).toFixed(2)}%`
      });
  
      return compressedFile;
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  };