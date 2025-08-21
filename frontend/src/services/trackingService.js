import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const startSession = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/tracking/session`, { userId });
        return response.data;
    } catch (error) {
        console.error('Error starting session:', error);
        throw error;
    }
};

const endSession = async (sessionId) => {
    try {
        const response = await axios.put(`${API_URL}/tracking/session/${sessionId}/end`);
        return response.data;
    } catch (error) {
        console.error('Error ending session:', error);
        throw error;
    }
};

const sendActivityData = async (sessionId, activityData) => {
    try {
        const response = await axios.post(`${API_URL}/tracking/activity`, {
            sessionId,
            ...activityData
        });
        return response.data;
    } catch (error) {
        console.error('Error sending activity data:', error);
        throw error;
    }
};

const getSessionReport = async (sessionId) => {
    try {
        const response = await axios.get(`${API_URL}/tracking/session/${sessionId}/report`);
        return response.data;
    } catch (error) {
        console.error('Error getting session report:', error);
        throw error;
    }
};

const getUserSessions = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/tracking/user/${userId}/sessions`);
        return response.data;
    } catch (error) {
        console.error('Error getting user sessions:', error);
        throw error;
    }
};

export default {
    startSession,
    endSession,
    sendActivityData,
    getSessionReport,
    getUserSessions
};