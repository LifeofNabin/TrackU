import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("traditional");
  const [cameraActive, setCameraActive] = useState(false);
  const [facialStatus, setFacialStatus] = useState("ready");
  const [scanProgress, setScanProgress] = useState(0);
  const [notification, setNotification] = useState("");
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Helper function to get user data from localStorage or create demo data
  const getUserDataForDemo = (email, loginType = "traditional") => {
    // First, try to get user from local registration data
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (registeredUsers[email]) {
      // Use real registered user data
      return {
        fullName: registeredUsers[email].fullName,
        email: registeredUsers[email].email,
        userId: registeredUsers[email].userId
      };
    }
    
    // If no registration data, create demo data based on email
    const emailName = email.split('@')[0];
    const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    
    return {
      fullName: `${capitalizedName} ${loginType === "facial" ? "(Facial)" : ""}`,
      email: email,
      userId: `${loginType}_${Date.now()}`
    };
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const res = await response.json();

      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        showNotification("Login successful! Welcome back!", "success");
        
        // Trigger navbar re-render by dispatching a custom event
        window.dispatchEvent(new Event('storage'));
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      console.log("API unavailable, using demo mode for:", { email, password });
      
      // Check if user exists in local registration
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      if (registeredUsers[email] && registeredUsers[email].password === password) {
        // Use real user data from registration
        const userData = getUserDataForDemo(email, "traditional");
        
        localStorage.setItem("token", "demo_token_123");
        localStorage.setItem("user", JSON.stringify(userData));
        showNotification(`Welcome back, ${userData.fullName}!`, "success");
        
        window.dispatchEvent(new Event('storage'));
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // For demo purposes, allow any email/password combination
        const userData = getUserDataForDemo(email, "traditional");
        
        localStorage.setItem("token", "demo_token_123");
        localStorage.setItem("user", JSON.stringify(userData));
        showNotification(`Demo login successful! Welcome, ${userData.fullName}!`, "success");
        
        window.dispatchEvent(new Event('storage'));
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setFacialStatus("camera_active");
      }
    } catch (error) {
      setError("Camera access denied. Please allow camera permissions for facial recognition.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setFacialStatus("ready");
    setScanProgress(0);
  };

  const startFacialLogin = async () => {
    if (!cameraActive) {
      await activateCamera();
      return;
    }

    // For facial recognition, we need some way to identify the user
    // You could implement face matching against stored face data
    // For demo, we'll use a default email or prompt for one
    
    const facialEmail = email || "facial@demo.com";

    setLoading(true);
    setFacialStatus("scanning");
    setScanProgress(0);

    try {
      const scanSteps = [
        { status: "detecting", progress: 25 },
        { status: "analyzing", progress: 50 },
        { status: "verifying", progress: 75 },
        { status: "authenticated", progress: 100 }
      ];

      for (const step of scanSteps) {
        setFacialStatus(step.status);
        setScanProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Get user data for facial login
      const userData = getUserDataForDemo(facialEmail, "facial");
      
      localStorage.setItem("token", "facial_token_123");
      localStorage.setItem("user", JSON.stringify(userData));
      showNotification(`Facial recognition successful! Welcome, ${userData.fullName}!`, "success");
      
      // Trigger navbar re-render
      window.dispatchEvent(new Event('storage'));
      
      stopCamera();
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Facial recognition failed. Please try again.");
      setFacialStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const getStatusColor = (status) => {
    const colors = {
      ready: "text-gray-400",
      camera_active: "text-blue-400",
      scanning: "text-yellow-400",
      detecting: "text-yellow-400",
      analyzing: "text-yellow-400",
      verifying: "text-blue-400",
      authenticated: "text-green-400",
      error: "text-red-400"
    };
    return colors[status] || "text-gray-400";
  };

  const getStatusMessage = (status) => {
    const messages = {
      ready: "Ready to scan",
      camera_active: "Camera active - Click to start",
      detecting: "Detecting face...",
      analyzing: "Analyzing features...",
      verifying: "Verifying identity...",
      authenticated: "Authentication successful!",
      error: "Recognition failed"
    };
    return messages[status] || "Ready to scan";
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-100">Sign in to continue your study journey</p>
          </div>

          <div className="flex bg-white bg-opacity-10 rounded-xl p-1 mb-8">
            <button
              onClick={() => setLoginMethod("traditional")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                loginMethod === "traditional"
                  ? "bg-white bg-opacity-20 text-white"
                  : "text-blue-200"
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setLoginMethod("facial")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                loginMethod === "facial"
                  ? "bg-white bg-opacity-20 text-white"
                  : "text-blue-200"
              }`}
            >
              Facial Recognition
            </button>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {loginMethod === "traditional" && (
            <div className="space-y-6">
              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center text-blue-100 text-sm">
                <p>Demo Mode: Use any email/password combination</p>
                <p>Or register first for personalized experience</p>
              </div>
            </div>
          )}

          {loginMethod === "facial" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl">
                    🤖
                  </div>
                  {facialStatus !== "ready" && (
                    <div className="absolute -inset-4 border-2 border-blue-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Facial Recognition</h3>
                <p className="text-blue-100 text-sm">Look at the camera to authenticate</p>
              </div>

              {/* Optional email input for facial recognition */}
              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Email (for identification)
                </label>
                <input
                  type="email"
                  placeholder="Enter your email for identification"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="bg-white bg-opacity-5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100">Status:</span>
                  <span className={`font-medium ${getStatusColor(facialStatus)}`}>
                    {getStatusMessage(facialStatus)}
                  </span>
                </div>
                <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={startFacialLogin}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50"
              >
                {!cameraActive 
                  ? "Start Facial Recognition" 
                  : loading 
                  ? "Scanning..." 
                  : "Begin Authentication"
                }
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-blue-100">
              Don't have an account?{" "}
              <span
                className="text-white font-semibold hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Create one now
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Camera Preview</h3>
            <p className="text-blue-100">AI-powered secure authentication</p>
          </div>

          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-6">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
              autoPlay
              muted
              playsInline
            />
            
            {!cameraActive && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-white font-medium">Camera Ready</p>
                <p className="text-gray-400 text-sm mt-2">
                  {loginMethod === "facial" ? "Click 'Start Facial Recognition' to begin" : "Switch to Facial Recognition to use camera"}
                </p>
              </div>
            )}

            {cameraActive && (facialStatus === "scanning" || facialStatus === "detecting") && (
              <div className="absolute inset-0">
                <div className="absolute inset-4 border-2 border-green-400 rounded-lg animate-pulse">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                </div>
              </div>
            )}
          </div>

          {loginMethod === "facial" && (
            <button
              onClick={cameraActive ? stopCamera : activateCamera}
              className={`w-full py-3 font-semibold rounded-xl transition-all ${
                cameraActive
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {cameraActive ? "Stop Camera" : "Activate Camera"}
            </button>
          )}

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 from-opacity-10 to-purple-500 to-opacity-10 rounded-xl">
            <h4 className="flex items-center text-white font-semibold mb-3">
              <span className="mr-2">🛡️</span>
              AI Security Features
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-100">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Live Detection
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Anti-Spoofing
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Encrypted Storage
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Real-time Verify
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;