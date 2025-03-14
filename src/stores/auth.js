// stores/auth.js
import {defineStore} from 'pinia'
import useApi from "@/helpers/api.js";

const {request} = useApi();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        returnUrl: '/'
    }),

    getters: {
        isAuthenticated() {
            return !!this.token;
        }
    },

    actions: {
        async login(encoded) {
            try {
                const response = await request(`/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encoded
                });

                const {data, status} = response;

                if (status !== 200) return data;

                // Actualizar estado del store
                this.user = data.user;
                this.token = data.access_token;

                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async register(encoded) {
            try {
                const response = await request(`/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encoded
                });

                const {data, status} = response;

                if (status !== 201) return data;

                this.user = data.user;
                this.token = data.access_token;

                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        async logout() {
            this.token = null;
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',
                storage: localStorage,
                paths: ['user', 'token']
            }
        ]
    }
})
