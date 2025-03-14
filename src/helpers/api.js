import axios from 'axios';
import {useAuthStore} from '@/stores/auth'
import {useChangesStore} from "@/stores/global.js";

export default function useApi() {

    const api = axios.create({
        baseURL: "/api",
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


    const request = async (endpoint, config = {}) => {
        try {
            console.log(`${config.method || 'GET'}: ${endpoint}`)
            const res = await api({
                method: config.method || 'GET',
                url: endpoint,
                data: config.body,
                params: config.params,
                headers: {
                    Authorization: `Bearer ${useAuthStore().token}`
                }
            })
            console.log(`URI: ${res.request.responseURL}`)

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
