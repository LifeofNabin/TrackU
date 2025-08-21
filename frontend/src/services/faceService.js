import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const verifyFace = async (userId, faceImage) => {
  try {
    const response = await axios.post(`${API_URL}/face/verify`, {
      userId,
      faceImage
    });
    return {
      verified: response.data.verified,
      confidence: response.data.confidence || 0
    };
  } catch (error) {
    console.error('Face verification failed:', error);
    throw new Error('Face verification service unavailable');
  }
};

export default {
  verifyFace
};