// stores/auth.js
import {defineStore} from 'pinia'

import useApi from '@/helpers/api'

const parseParams = (encoded) => {
    console.log(encoded)
    return encoded.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        acc[key] = value;
        return acc;
    }, {});
}

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
                const response = await fetch(`api/auth/login`, {
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

        async register(encoded) {
            try {
                const response = await fetch(`api/auth/register`, {
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
