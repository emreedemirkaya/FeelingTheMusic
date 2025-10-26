import axios from 'axios';

// Backend'imizin çalıştığı ana URL
const API_URL = 'http://127.0.0.1:5000';

// API istekleri için önceden yapılandırılmış bir axios örneği (instance)
const api = axios.create({
  baseURL: API_URL,
});

export default api;