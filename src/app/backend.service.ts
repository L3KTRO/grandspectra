import {Injectable} from '@angular/core';
import {Movie} from './models/Movie';
import axios, {Axios} from 'axios';

@Injectable({providedIn: 'root'})
export class BackendService {
  baseUrl = 'https://gs-backend.lestro.top';

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

}
