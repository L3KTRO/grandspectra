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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encoded
                });

                if (!response.ok) throw new Error('Credenciales incorrectas');

                const data = await response.json();

                // Actualizar estado del store
                this.user = data.user;
                this.token = data.access_token;

                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async register(userData) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al registrar usuario');
                }

                // Auto-login después del registro
                return this.login({
                    email: userData.email,
                    password: userData.password
                });
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
