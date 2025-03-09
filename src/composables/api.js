import {ref} from 'vue';
import axios from 'axios';

export default function useApi() {
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Interceptor para manejo global de errores
    api.interceptors.response.use(
        response => response,
        error => {
            console.error(`API Error: ${error.config.url}`, error.response?.data);
            return Promise.reject(error);
        }
    );

    const request = async (endpoint, config = {}) => {
        const response = await api({
            method: config.method || 'GET',
            url: endpoint,
            data: config.body,
            params: config.query
        });
        return response.data;
    };

    return {request};
}
