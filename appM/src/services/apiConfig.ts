// API Configuration for the mobile app
export const API_CONFIG = {
  // Update this URL to match your server's address
  // For local development with Metro bundler, use your computer's IP address
  // instead of localhost (e.g., 'http://192.168.1.100:3000')
  // For Android emulator, use 'http://10.0.2.2:3000'
  // For iOS simulator, use 'http://localhost:3000'
  BASE_URL: "http://192.168.1.197:3000",

  // Timeout for API requests in milliseconds
  TIMEOUT: 15000, // Increased to 15 seconds for better reliability

  // Enable/disable API usage - set to false to use dummy data
  // Set to true to enable real email sending via server API
  ENABLED: true,
};

// Helper to get the full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
