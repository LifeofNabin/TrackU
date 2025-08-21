import { useState, useEffect, useRef } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs';
import { io } from 'socket.io-client';

const WebcamFeed = ({ userId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [attentionScore, setAttentionScore] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize face detection model
    const loadModel = async () => {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
        { maxFaces: 1 }
      );
      setModel(model);
    };

    loadModel();

    // Initialize Socket.IO connection
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!model || !isMonitoring) return;

    let animationFrameId;
    let lastSentTime = 0;

    const detectFaces = async () => {
      if (videoRef.current && canvasRef.current) {
        const predictions = await model.estimateFaces({
          input: videoRef.current,
          returnTensors: false,
          flipHorizontal: false,
          predictIrises: true
        });

        // Calculate attention score based on face position and eye movement
        if (predictions.length > 0) {
          const face = predictions[0];
          const score = calculateAttentionScore(face);
          setAttentionScore(score);

          // Send data to backend every 2 seconds
          const now = Date.now();
          if (now - lastSentTime > 2000) {
            socketRef.current.emit('face_data', { 
              userId, 
              attentionScore: score,
              faceDetected: true
            });
            lastSentTime = now;
          }
        }

        animationFrameId = requestAnimationFrame(detectFaces);
      }
    };

    if (isMonitoring) {
      detectFaces();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [model, isMonitoring, userId]);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      videoRef.current.srcObject = stream;
      setIsMonitoring(true);
      socketRef.current.emit('start_monitoring', userId);
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  const stopMonitoring = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach(track => track.stop());
    setIsMonitoring(false);
  };

  const calculateAttentionScore = (face) => {
    // Simple attention score calculation based on face landmarks
    const leftEye = face.annotations.leftEyeUpper0;
    const rightEye = face.annotations.rightEyeUpper0;
    const nose = face.annotations.noseTip;

    // Calculate eye openness
    const leftEyeOpenness = calculateEyeOpenness(face.annotations.leftEyeIris);
    const rightEyeOpenness = calculateEyeOpenness(face.annotations.rightEyeIris);
    const eyeAvg = (leftEyeOpenness + rightEyeOpenness) / 2;

    // Calculate head position (simple approach)
    const headTilt = Math.abs(nose[0][0] - (leftEye[0][0] + rightEye[0][0]) / 2);

    // Combine factors for attention score (0-100)
    const score = Math.max(0, 100 - (headTilt * 10) - ((1 - eyeAvg) * 30));
    return Math.min(100, Math.round(score));
  };

  const calculateEyeOpenness = (irisLandmarks) => {
    // Simple eye openness calculation
    if (!irisLandmarks || irisLandmarks.length < 2) return 0.5;
    const irisDiameter = Math.sqrt(
      Math.pow(irisLandmarks[0][0] - irisLandmarks[1][0], 2) +
      Math.pow(irisLandmarks[0][1] - irisLandmarks[1][1], 2)
    );
    // Normalize (this is a simplified approach)
    return Math.min(1, Math.max(0, irisDiameter / 30));
  };

  return (
    <div className="webcam-feed">
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
      </div>
      <div className="controls">
        {!isMonitoring ? (
          <button onClick={startMonitoring}>Start Monitoring</button>
        ) : (
          <button onClick={stopMonitoring}>Stop Monitoring</button>
        )}
      </div>
      <div className="attention-score">
        <h3>Attention Score: {attentionScore}</h3>
        <div className="score-bar">
          <div 
            className="score-fill" 
            style={{ width: `${attentionScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WebcamFeed;