import React, { useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const webcamRef = React.useRef(null);
  const navigate = useNavigate();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const handleAuth = () => {
    if (isRegister) {
      console.log("Registering with:", { email, password, image });
    } else {
      console.log("Logging in with:", { userId, password, image });
    }
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <div className="auth-buttons">
          <button onClick={() => setIsRegister(false)} className="auth-btn login">Login</button>
          <button onClick={() => setIsRegister(true)} className="auth-btn register">Register</button>
        </div>
        <div className="form-container">
          {isRegister ? (
            <>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </>
          ) : (
            <>
              <input type="text" placeholder="User ID / Email" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </>
          )}
          <div className="webcam-container">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam" />
            <button onClick={capture} className="capture-btn">Capture Face</button>
          </div>
        </div>
        <button onClick={handleAuth} className="auth-btn submit">{isRegister ? "Register" : "Login"}</button>
      </div>
    </div>
  );
};

export default AuthPage;
