// const API_ENDPOINT = 'https://data-x-gen-api.onrender.com';
const API_ENDPOINT = 'http://localhost:1337';
export const API = {
  GET_API_KEY: `${API_ENDPOINT}/user/api-key`,
  GEN_DATA: `${API_ENDPOINT}/api/generate/data`,
  PROFILE: `${API_ENDPOINT}/user/me`,
  FORGOT_API_KEY: `${API_ENDPOINT}/user/forgot-api-key`,
  GET_TYPES: `${API_ENDPOINT}/user/supportedTypes`,
};
