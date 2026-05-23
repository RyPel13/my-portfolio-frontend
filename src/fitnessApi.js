import axios from 'axios';

const fitnessApi = axios.create({
  baseURL: 'http://localhost:8081'
});

export default fitnessApi;
