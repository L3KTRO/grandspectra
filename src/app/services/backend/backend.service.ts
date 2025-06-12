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

  public api = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  getGenres() {
    return this.api.get('/genres');
  }

  getMovies(filter: string = "", genres: string[] = [], sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    return this.api.get('/meili/movies', {
      params: {
        search: filter,
        genres,
        sort_by,
        page,
        hitsPerPage
      }
    });
  }

  getTv(filter: string = "", genres: string[] = [], sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    return this.api.get('/meili/tv', {
      params: {
        search: filter,
        genres,
        sort_by,
        page,
        hitsPerPage
      }
    });
  }

  getPeople(filter: string = "", sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    return this.api.get('/meili/people', {
      params: {
        search: filter,
        sort_by,
        page,
        hitsPerPage
      }
    });
  }

  globalSearch(filter: string = "") {
    return this.api.get('/meili/all', {
      params: {
        search: filter
      }
    });
  }

  getUsers(sortBy: string = 'followers') {
    return this.api.get('/users', {
      params: {
        relations: ["reviews", "followers", "watched"],
        sort_by: sortBy,
        per_page: 10,
      }
    });
  }

  getMe() {
    return this.authRequest('/me', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem(this.TOKEN_KEY)}`,
      },
      validateStatus: (status) => status === 200 || status === 401,
    })
  }

  getUser(username: string) {
    return this.api.get(`/users/${username}`, {
      validateStatus: (status) => status === 200 || status === 404,
    })
  }

  request(endpoint: string, options: AxiosRequestConfig = {}) {
    return this.api.get(`${endpoint}`, options);
  }

  // AUTH

  public authRequest(endpoint: string, options: AxiosRequestConfig = {}) {
    console.log(`${endpoint}`)
    const req = this.api.request({
      url: endpoint,
      ...options,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem(this.TOKEN_KEY)}`,
        ...options.headers,
      },
    })

    req.then((it) => {
      console.log(it);
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

  saveList(listId: string, options: AxiosRequestConfig = {}) {
    return this.authRequest(`/lists/${listId}/save`, options)
  };

  follow(username: string) {
    return this.authRequest('/me/follow/' + username, {
      method: 'PUT',
    });
  }

  unfollow(username: string) {
    return this.authRequest('/me/follow/' + username, {
      method: 'DELETE',
    });
  }

  async login(credentials: { email: string; password: string }) {
    const res = await this.api.post<Auth>('/auth/login', credentials, {
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

  async register(credentials: { email: string; password: string; username: string, password_confirmation: string }) {
    const res = await this.api.post<Auth | any>('/auth/register', credentials, {
      validateStatus: (status) => status !== 500,
    });

    if (res.status === 201) {
      const {access_token} = res.data;
      sessionStorage.setItem(this.TOKEN_KEY, access_token);
      this.syncStore.addChangeLogin()
    }

    return res;
  }

  async editProfile(data: {
    username?: string;
    email?: string;
    password?: string;
    password_confirmation?: string,
    avatar?: File
  }) {
    if (data.password === '') delete data.password;
    if (data.password_confirmation === '') delete data.password_confirmation;
    if (data.username === "") delete data.username;
    if (data.email === "") delete data.email;
    if (!data.avatar) delete data.avatar;
    const formData = new FormData();

    if (data.avatar) {
      formData.append('avatar', data.avatar);

      if (data.username) formData.append("username", data.username);
      if (data.email) formData.append("email", data.email);
      if (data.password) formData.append("password", data.password);
      if (data.password_confirmation) formData.append("password_confirmation", data.password_confirmation);
    }


    const res = await this.authRequest('/auth/edit', {
      method: 'POST',
      data: formData.has("avatar") ? formData : data,
      headers: {
        'Content-Type': formData.has("avatar") ? 'multipart/form-data' : 'application/json',
      },
      validateStatus: (status) => status !== 1,
    });

    if (res.status === 200) {
      this.syncStore.addChangeProfile()
    }

    return res;
  }

  async resendVerification() {
    return await this.authRequest('/auth/resend-verification', {
      method: 'POST',
      validateStatus: (status) => status === 200,
    });
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.syncStore.addChangeLogin()
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

}
