import {inject, Injectable} from '@angular/core';
import axios, {AxiosRequestConfig} from 'axios';
import {environment} from '../../../environments/environment';
import {Auth} from '../../models/Auth';
import {SyncStore} from '../../stores/SyncStore';
import {LoadingInterceptor} from '../../helpers/load-interceptor/loading.interceptor';

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

  constructor(private axiosInterceptorService: LoadingInterceptor) {
    // Configura los interceptores para mostrar/ocultar el spinner
    //this.axiosInterceptorService.setupInterceptors(this.api);
  }

  getGenres() {
    return this.api.get(this.baseUrl + '/genres');
  }

  getPopularMovies() {
    return this.api.get(this.baseUrl + '/movies?sort_by=popularity&sort_dir=desc');
  }

  getUsers(sortBy: string = 'followers') {
    return this.api.get(this.baseUrl + '/users', {
      params: {
        sortBy,
        per_page: 10,
      }
    });
  }

  getPopularTv() {
    return this.api.get(this.baseUrl + '/tv?sort_by=popularity&sort_dir=desc');
  }

  getMe() {
    return this.authRequest('/me', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem(this.TOKEN_KEY)}`,
      },
      validateStatus: (status) => status === 200 || status === 401,
    })
  }

  getUser(id: number) {
    return this.api.get(`/users/${id}`)
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
        'Authorization': `Bearer ${sessionStorage.getItem(this.TOKEN_KEY)}`,
        ...options.headers,
      },
    })

    req.then((it) => {
      console.log(it)
      if (options.method && options.method !== "GET") this.syncStore.addChangeProfile()
    });


    return req
  }

  list(id: string, options: AxiosRequestConfig = {}) {
    return this.authRequest(`/lists/${id}`, options)
  }

  lists(options: AxiosRequestConfig = {}) {
    return this.authRequest('/lists', options)
  }

  voteList(listId: string, options: AxiosRequestConfig = {}) {
    return this.authRequest(`/lists/${listId}/vote`, options)
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
