import {Injectable} from '@angular/core';
import {AxiosInstance} from 'axios';
import {LoadingService} from '../../services/loading/loading.service';

@Injectable({providedIn: 'root'})
export class LoadingInterceptor {
  constructor(private loadingService: LoadingService) {
  }

  setupInterceptors(axiosInstance: AxiosInstance): void {
    // Request interceptor
    axiosInstance.interceptors.request.use(
      (config) => {
        console.log("Request interceptor");
        this.loadingService.show();
        return config;
      },
      (error) => {
        console.log("Request interceptor error");
        this.loadingService.hide();
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response) => {
        console.log("Response interceptor");
        this.loadingService.hide();
        return response;
      },
      (error) => {
        console.log("Response interceptor error");
        this.loadingService.hide();
        return Promise.reject(error);
      }
    );
  }
}
