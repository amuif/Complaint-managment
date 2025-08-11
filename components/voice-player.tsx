'use client';

import { useState, useRef, useEffect, SetStateAction, Dispatch } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, AlertCircle, LucideCheck } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceFeedbackProps {
  audioUrl: string | null;
}
export const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ audioUrl }) => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check browser support and HTTPS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if we're on HTTPS (or localhost)
      const isSecure =
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (!isSecure) {
        setIsSupported(false);
        setError(
          "Voice recording requires a secure connection (HTTPS). This may be why recording isn't working on the Vercel deployment."
        );
        return;
      }

      // Log browser information to help with debugging
      const userAgent = navigator.userAgent;
      console.log('Browser User Agent:', userAgent);

      // Check MediaRecorder API support
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        setIsSupported(false);
        setError(
          "Your browser doesn't support voice recording. Please try using Chrome, Firefox, or Edge browser."
        );
        return;
      }

      // Check if permissions are already granted
      navigator.permissions
        ?.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          setPermissionGranted(permissionStatus.state === 'granted');

          permissionStatus.onchange = () => {
            setPermissionGranted(permissionStatus.state === 'granted');
          };
        })
        .catch((err) => {
          console.log('Permission query not supported, will check when recording starts', err);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setPermissionGranted(true);
      console.log('Microphone access granted');

      // Determine supported audio format
      let options = {};
      const supportedTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg',
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          options = { mimeType: type };
          console.log(`Using mime type: ${type}`);
          break;
        }
      }

      console.log('Creating MediaRecorder with options:', options);
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Request data immediately when recording starts
      mediaRecorder.start(100); // Record in 100ms chunks for more reliable recording
      console.log('MediaRecorder started with 100ms timeslice');

      mediaRecorder.ondataavailable = (event) => {
        console.log(`Data available: ${event.data.size} bytes`);
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(
            `Total chunks: ${
              audioChunksRef.current.length
            }, total size: ${audioChunksRef.current.reduce(
              (total, chunk) => total + chunk.size,
              0
            )} bytes`
          );

          // Don't create temporary blobs while recording to avoid memory issues
          // We'll create the final blob when recording is stopped
        }
      };

      mediaRecorder.onstop = () => {
        try {
          console.log(`Recording stopped, processing ${audioChunksRef.current.length} chunks`);
          if (audioChunksRef.current.length === 0) {
            setError(
              'No audio data was captured. Please try again and ensure your microphone is working.'
            );
            return;
          }

          // Force one last data request before processing
          try {
            mediaRecorder.requestData();
          } catch (e) {
            console.log('Could not request final data chunk', e);
          }

          // Use the explicit mime type that was determined earlier
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/webm',
          });
          console.log(`Created final blob of type ${audioBlob.type}, size ${audioBlob.size}`);

          if (audioBlob.size === 0) {
            setError('Recorded audio is empty. Please check your microphone and try again.');
            return;
          }

          // Clean up any previous URL
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }

          const url = URL.createObjectURL(audioBlob);
          setTranscription(
            'Your voice complaint has been recorded. Submit this form to send it to our team.'
          );
          console.log('Recording processed successfully');
        } catch (error) {
          console.error('Error creating audio blob:', error);
          setError(
            `Failed to process recording: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError(
          `Error during recording: ${event instanceof ErrorEvent ? event.message : 'Unknown error'}`
        );
        setIsRecording(false);
      };

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionGranted(false);

      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setError(
            'Microphone access denied. Please allow microphone access in your browser settings and try again.'
          );
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setError('No microphone detected. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          setError('Cannot access your microphone. It might be in use by another application.');
        } else if (error.name === 'OverconstrainedError') {
          setError(
            "Your microphone doesn't meet the required constraints. Please try with a different microphone."
          );
        } else if (error.name === 'SecurityError') {
          setError(
            'Media recording is not allowed in this context. This site may need to use HTTPS.'
          );
        } else {
          setError(`Could not access microphone: ${error.name} - ${error.message}`);
        }
      } else {
        setError(
          `Could not access microphone: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        console.log('MediaRecorder stopped');

        // Store the mime type right away in case it's lost when we clean up
        const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';

        // Stop all audio tracks
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => {
            track.stop();
            console.log(`Track ${track.id} stopped`);
          });
        }

        // Process the recorded audio immediately instead of relying on onstop
        setTimeout(() => {
          if (audioChunksRef.current.length === 0) {
            setError(
              'No audio data was captured. Please try again and ensure your microphone is working.'
            );
            return;
          }

          try {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: mimeType,
            });
            console.log(
              `Created blob directly in stopRecording: type=${mimeType}, size=${audioBlob.size}`
            );

            if (audioBlob.size > 0) {
              if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
              }
              const url = URL.createObjectURL(audioBlob);
              setTranscription(
                'Your voice complaint has been recorded. Submit this form to send it to our team.'
              );
            } else {
              setError('Recorded audio is empty. Please check your microphone and try again.');
            }
          } catch (error) {
            console.error('Error processing audio in stopRecording:', error);
            setError(
              `Failed to process recording: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            );
          }
        }, 200); // Small delay to make sure all chunks are processed
      } catch (error) {
        console.error('Error stopping recording:', error);
        setError(
          `Error stopping the recording: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      } finally {
        setIsRecording(false);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        console.log('Audio playback paused');
      } else {
        console.log('Starting audio playback');
        audioRef.current.play().catch((err) => {
          console.error('Error playing audio:', err);
          setError(
            `Failed to play the recording: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
        });
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error during playback:', error);
      setError(
        `Error playing the recording: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error ||
            "Your browser doesn't support voice recording. Please try using Chrome, Firefox, or Edge browser."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {permissionGranted === false && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Microphone permission denied. Please allow microphone access in your browser settings.
          </AlertDescription>
        </Alert>
      )}

      {permissionGranted === true && !error && (
        <Alert className="mb-4 bg-orange-50 border-orange-200">
          <LucideCheck className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Microphone access granted. Ready to record your voice complaint.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <Button
          size="lg"
          type="button"
          variant={isRecording ? 'destructive' : 'default'}
          onClick={isRecording ? stopRecording : startRecording}
          className="flex items-center gap-2 h-12 px-6"
        >
          {isRecording ? (
            <>
              <Square className="h-5 w-5" />
              {t('feedback.voice.stop')}
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              {t('feedback.form.recordVoice')}
            </>
          )}
        </Button>

        {audioUrl && (
          <Button
            size="lg"
            variant="outline"
            type="button"
            onClick={togglePlayback}
            className="flex items-center gap-2 h-12 px-6"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5" />
                {t('feedback.voice.pause')}
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                {t('feedback.voice.play')}
              </>
            )}
          </Button>
        )}
      </div>
      {audioUrl && (
        <div className="mt-4 p-3 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Your recorded audio:</p>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            controls
            controlsList="nodownload"
            preload="auto"
            className="w-full"
          />
          <input type="hidden" value={audioUrl} />
          <div className="mt-3 text-xs text-gray-500">
            If the controls above don't work,{' '}
            <a
              href={audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              click here to open in a new tab
            </a>
          </div>
        </div>
      )}

      {transcription && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h4 className="text-base font-medium mb-2">{t('feedback.voice.transcription')}</h4>
          <p className="text-sm">{transcription}</p>
        </div>
      )}
    </div>
  );
};
