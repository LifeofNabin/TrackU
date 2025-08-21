import React, { useRef, useEffect, forwardRef } from 'react';
import { Camera } from 'lucide-react';
import MetricsOverlay from './MetricsOverlay';

const VideoFeed = forwardRef(({ 
  cameraPermission, 
  setCameraPermission, 
  isSessionActive, 
  metrics, 
  onInitializeCamera 
}, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      console.log('Requesting camera access...');
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log('Camera access granted!');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(console.error);
        };
        setCameraPermission(true);
        if (onInitializeCamera) onInitializeCamera();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraPermission(false);
    }
  };

  // Auto-initialize camera when session starts
  useEffect(() => {
    if (isSessionActive && cameraPermission === null) {
      initializeCamera();
    }
  }, [isSessionActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (ref) {
      ref.current = {
        video: videoRef.current,
        canvas: canvasRef.current,
        initializeCamera,
        stream: streamRef.current
      };
    }
  }, [ref]);

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-96 bg-gray-900 rounded-lg object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Metrics Overlay */}
        {isSessionActive && cameraPermission && (
          <MetricsOverlay metrics={metrics} />
        )}

        {/* Camera Permission Message */}
        {cameraPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Camera className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Camera Access Required</h3>
              <p className="text-gray-300 mb-4">Please allow camera access for face tracking</p>
              <button 
                onClick={initializeCamera}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
              >
                Enable Camera
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {cameraPermission === null && isSessionActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2 text-white">Initializing Camera...</h3>
              <p className="text-gray-300">Please allow camera access when prompted</p>
            </div>
          </div>
        )}

        {/* Session Not Started */}
        {!isSessionActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Camera Ready</h3>
              <p className="text-gray-300">Click "Start Session" to begin monitoring</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

VideoFeed.displayName = 'VideoFeed';

export default VideoFeed;