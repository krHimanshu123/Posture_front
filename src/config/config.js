const DEFAULT_BACKEND = 'https://posture-back.onrender.com';

const config = {
  // Use environment variables when provided (REACT_APP_*), otherwise default to deployed backend
  API_URL: process.env.REACT_APP_API_URL || DEFAULT_BACKEND,
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || DEFAULT_BACKEND,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  ANALYSIS_INTERVAL: 1000, // 1 second
  WEBCAM_CONFIG: {
    width: 640,
    height: 480,
    facingMode: 'user',
  },
};

export default config;
