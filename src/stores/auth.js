// stores/auth.js
import {defineStore} from 'pinia'

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
                const response = await fetch(`/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encoded
                });

                const data = await response.json();

                if (!response.ok) return data;

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
                const response = await fetch(`/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encoded
                });

                if (!response.ok) {
                    return await response.json();
                }

                const data = await response.json();
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
