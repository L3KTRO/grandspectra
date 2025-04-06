import {Injectable} from '@angular/core';
import axios, {AxiosRequestConfig} from 'axios';

@Injectable({providedIn: 'root'})
export class BackendService {
  baseUrl = 'http://192.168.0.39:9000';

  api = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  getPopularMovies() {
    return this.api.get(this.baseUrl + '/movies?sort_by=popularity&sort_dir=desc');
  }

  getPopularTv() {
    return this.api.get(this.baseUrl + '/tv?sort_by=popularity&sort_dir=desc');
  }

  request(endpoint: string, options: AxiosRequestConfig<any> = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const data = this.api.get(url, options);

    console.log(data);
    return data;
  }

}
