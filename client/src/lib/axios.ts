import axios from 'axios';

export const API_BASE_URL = 'http://10.0.0.15:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
});