import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-64 h-48 border" />
      <button onClick={capture} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded">Capture Face</button>
      {image && <img src={image} alt="Captured" className="mt-2 w-24 h-24 border rounded-full" />}
    </div>
  );
};

export default WebcamCapture;
