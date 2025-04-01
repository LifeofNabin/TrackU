import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ setCapturedImage }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImage(capturedImage);
    setCapturedImage(capturedImage);
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam ref={webcamRef} screenshotFormat="image/png" className="w-64 h-48" />
      <button onClick={capture} className="bg-green-500 text-white p-2 mt-2">Capture Face</button>
      {image && <img src={image} alt="Captured Face" className="w-32 h-32 mt-2 rounded-full" />}
    </div>
  );
};

export default WebcamCapture;
