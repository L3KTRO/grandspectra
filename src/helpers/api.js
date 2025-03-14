import axios from 'axios';
import {useAuthStore} from '@/stores/auth'
import {useChangesStore} from "@/stores/global.js";

/**
 * Helper para realizar peticiones a la API
 * @returns {{request: ((function(*, {}=): Promise<axios.AxiosResponse<any>|*|undefined>)|*)}}
 */

export default function useApi() {

    // Crear instancia de axios
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        validateStatus: function () {
            return true;
        },
    });

    // Interceptor para manejo global de errores
    api.interceptors.response.use(
        response => response,
        error => {
            console.error(`API Error: ${error.config.url}`, error.response?.data);
            return Promise.reject(error);
        }
    );


    // Función para realizar peticiones
    const request = async (endpoint, config = {}) => {
        try {
            // Traza de la petición
            console.log(`${config.method || 'GET'}: ${endpoint}`)
            const res = await api({
                method: config.method || 'GET',
                url: endpoint,
                data: config.body,
                params: config.params,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`,
                    ...config.headers
                }
            })

            // Si la petición es diferente a GET, se agrega un cambio al store global, entra al store para averguar más
            if (config.method && config.method !== 'GET') {
                useChangesStore().addChange();
            }

            return res;
        } catch (error) {
            return error
        }
    }

    return {request};
}
