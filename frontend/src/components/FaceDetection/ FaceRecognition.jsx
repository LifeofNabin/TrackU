import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { useAuth } from '../../context/AuthContext';
import faceService from '../../services/faceService';
import './FaceRecognition.css'; // Create this CSS file for the new styles

const FaceRecognition = ({ onFaceDetected }) => {
    const { user } = useAuth();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionInterval, setDetectionInterval] = useState(null);
    const [message, setMessage] = useState('Initializing...');
    const [lastDetection, setLastDetection] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState({});

    // Configuration
    const DETECTION_THROTTLE = 1000; // 1 second between detections
    const CONFIDENCE_THRESHOLD = 0.7;

    useEffect(() => {
        const loadModels = async () => {
            try {
                setMessage('Loading face detection model...');
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                
                setMessage('Loading landmark model...');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                
                setMessage('Loading recognition model...');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
                
                setModelsLoaded(true);
                setMessage('Models loaded. Ready to detect.');
            } catch (error) {
                console.error('Model loading failed:', error);
                setMessage(`Error: ${error.message}`);
            }
        };

        loadModels();

        return () => {
            if (detectionInterval) clearInterval(detectionInterval);
            if (webcamRef.current?.video?.srcObject) {
                webcamRef.current.video.srcObject.getTracks().forEach(track => track.stop());
            }
            faceapi.dispose();
        };
    }, []);

    const startDetection = () => {
        if (!modelsLoaded) {
            setMessage('Models not loaded yet!');
            return;
        }
        
        setIsDetecting(true);
        setMessage('Starting detection...');
        
        let lastDetectionTime = 0;
        const interval = setInterval(async () => {
            const now = Date.now();
            if (now - lastDetectionTime < DETECTION_THROTTLE) return;
            lastDetectionTime = now;

            try {
                if (!webcamRef.current || !canvasRef.current) return;
                
                const video = webcamRef.current.video;
                const canvas = canvasRef.current;
                const startTime = performance.now();
                
                // Detect faces with landmarks
                const detections = await faceapi.detectAllFaces(
                    video, 
                    new faceapi.TinyFaceDetectorOptions({ 
                        inputSize: 512,
                        scoreThreshold: 0.5 
                    })
                ).withFaceLandmarks();
                
                // Update canvas overlay
                faceapi.matchDimensions(canvas, video);
                faceapi.draw.drawDetections(canvas, detections);
                faceapi.draw.drawFaceLandmarks(canvas, detections);
                
                // Process results
                if (detections.length > 0) {
                    const faceImage = webcamRef.current.getScreenshot();
                    try {
                        const result = await faceService.verifyFace(user.userId, faceImage);
                        
                        if (result.verified && result.confidence >= CONFIDENCE_THRESHOLD) {
                            const detectionResult = {
                                faceDetected: true,
                                confidence: result.confidence,
                                landmarks: detections[0].landmarks,
                                timestamp: new Date()
                            };
                            setLastDetection(detectionResult);
                            onFaceDetected(detectionResult);
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        onFaceDetected({ 
                            faceDetected: false, 
                            error: error.message 
                        });
                    }
                } else {
                    onFaceDetected({ faceDetected: false });
                }
                
                // Record performance
                const endTime = performance.now();
                setPerformanceMetrics({
                    lastDetectionTime: (endTime - startTime).toFixed(1) + 'ms',
                    fps: (1000 / (endTime - startTime)).toFixed(1)
                });
                
            } catch (error) {
                console.error('Detection error:', error);
                setMessage(`Detection error: ${error.message}`);
            }
        }, 300); // Fast interval but throttled execution
        
        setDetectionInterval(interval);
    };

    const stopDetection = () => {
        setIsDetecting(false);
        if (detectionInterval) clearInterval(detectionInterval);
        setMessage('Detection stopped.');
        
        // Clear canvas
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="face-recognition-container">
            <div className="webcam-container">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ 
                        facingMode: 'user',
                        width: 640,
                        height: 480
                    }}
                    style={{ display: 'block' }}
                />
                <canvas 
                    ref={canvasRef} 
                    className="overlay-canvas"
                    width="640"
                    height="480"
                />
            </div>
            
            <div className="controls">
                {!isDetecting ? (
                    <button 
                        onClick={startDetection} 
                        disabled={!modelsLoaded}
                        className="start-button"
                    >
                        {modelsLoaded ? 'Start Detection' : 'Loading Models...'}
                    </button>
                ) : (
                    <button 
                        onClick={stopDetection}
                        className="stop-button"
                    >
                        Stop Detection
                    </button>
                )}
            </div>
            
            <div className="status-panel">
                <div className="status-message">{message}</div>
                
                {isDetecting && (
                    <div className="detection-info">
                        {lastDetection?.faceDetected ? (
                            <div className="detection-status active">
                                🟢 Face detected ({(lastDetection.confidence * 100).toFixed(1)}%)
                            </div>
                        ) : (
                            <div className="detection-status inactive">
                                🔴 Searching for face...
                            </div>
                        )}
                        <div className="performance-metrics">
                            <span>Speed: {performanceMetrics.lastDetectionTime}</span>
                            <span>FPS: {performanceMetrics.fps}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceRecognition;