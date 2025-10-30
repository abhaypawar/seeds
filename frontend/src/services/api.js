import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';

export const api = {
  getLatestScores: (params) => 
    axios.get(`${API_BASE}/scores/latest`, { params }),
  
  getCustomerScore: (id) => 
    axios.get(`${API_BASE}/customers/${id}/score`),
  
  getAggregatedScores: (params) => 
    axios.get(`${API_BASE}/customers`, { params: { agg: true, ...params } }),
  
  getUploadUrl: () => 
    axios.post(`${API_BASE}/ingest/upload-url`),
  
  uploadFile: (url, file) => 
    axios.put(url, file, { headers: { 'Content-Type': 'text/csv' } })
};
