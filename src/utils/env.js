/**
 * Get the application version from environment variables
 * @returns {string} The application version (default: v1.0.0)
 */
export const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || 'v1.0.0';
};

/**
 * Determine the environment based on API base URL
 * - If contains "localhost" → "LOCAL"
 * - If contains "qa" → "QA"
 * - Otherwise → "PRODUCTION"
 * @returns {string} The environment name
 */
export const getEnvironment = () => {
  const apiBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || '';
  const apiBaseLower = apiBase.toLowerCase();
  
  if (apiBaseLower.includes('localhost')) {
    return 'LOCAL';
  } else if (apiBaseLower.includes('qa')) {
    return 'QA';
  } else {
    return 'PRODUCTION';
  }
};
