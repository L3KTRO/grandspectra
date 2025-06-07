// meili.service.ts
import {Injectable} from '@angular/core';
import {MeiliSearch} from 'meilisearch';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeiliService {
  client = new MeiliSearch({
    host: environment.apiUrl + "/meili",
    apiKey: "masterKey"
  });


  async movies(filter: string, sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    return await this.client.index('movies').search(filter, {
      sort_by,
      hitsPerPage,
      page
    });
  }

  async tv(filter: string, sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    return await this.client.index('tv').search(filter, {
      sort_by,
      hitsPerPage,
      page
    });
  }

  async people(filter: string, sort_by: string, page: number = 1, hitsPerPage: number = 20) {
    return await this.client.index('people').search(filter, {
      sort_by,
      hitsPerPage,
      page
    });
  }
}
