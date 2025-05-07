import {inject, Injectable} from '@angular/core';
import axios, {AxiosRequestConfig} from 'axios';
import {environment} from '../../../environments/environment';
import {Auth} from '../../models/Auth';
import {SyncStore} from '../../stores/SyncStore';

@Injectable({providedIn: 'root'})
export class BackendService {
  baseUrl = environment.apiUrl;
  syncStore = inject(SyncStore);
  private readonly TOKEN_KEY = 'access_token';
  api = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  getGenres() {
    return this.api.get(this.baseUrl + '/genres');
  }

  getPopularMovies() {
    return this.api.get(this.baseUrl + '/movies?sort_by=popularity&sort_dir=desc');
  }

  getPopularTv() {
    return this.api.get(this.baseUrl + '/tv?sort_by=popularity&sort_dir=desc');
  }

  getMe() {
    return this.api.get(this.baseUrl + '/me', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem(this.TOKEN_KEY)}`,
      },
    })
  }

  request(endpoint: string, options: AxiosRequestConfig = {}) {
    return this.api.get(`${this.baseUrl}${endpoint}`, options);
  }

  // AUTH

  authRequest(endpoint: string, options: AxiosRequestConfig = {}) {
    const req = this.api.request({
      url: `${this.baseUrl}${endpoint}`,
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${sessionStorage.getItem(this.TOKEN_KEY)}`,
      },
    })

    req.then(() => {
      if (options.method !== "GET") this.syncStore.addChangeProfile()
    });

    return req
  }

  async login(credentials: { email: string; password: string }) {
    const res = await this.api.post<Auth>(environment.apiUrl + '/auth/login', credentials, {
      validateStatus: (status) => status === 200 || status === 401,
    })

    if (res.status === 200) {
      const {access_token} = res.data;
      sessionStorage.setItem(this.TOKEN_KEY, access_token);
      this.syncStore.addChangeLogin()
      return res.data;
    } else {
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.syncStore.addChangeLogin()
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

}
