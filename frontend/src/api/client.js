import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const sendChatMessage = async (sessionId, message) => {
  const response = await api.post('/chat', { session_id: sessionId, message });
  return response.data;
};

export const getTopPrograms = async (domain, countries, budget = "Any") => {
  const response = await api.post('/top-programs', { domain, countries, budget });
  return response.data.text;
};

export const generateRoadmap = async (domain) => {
  const response = await api.post('/generate-roadmap', { domain });
  return response.data.text;
};

export const getSummary = async (domain, programsText, roadmapText) => {
  const response = await api.post('/summary', { domain, programs_text: programsText, roadmap_text: roadmapText });
  return response.data.text;
};
