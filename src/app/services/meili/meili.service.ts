// meili.service.ts
import {Injectable} from '@angular/core';
import {MeiliSearch} from 'meilisearch';

@Injectable({
  providedIn: 'root'
})
export class MeiliService {
  client = new MeiliSearch({
    host: "192.168.0.39:7700",
    apiKey: "masterKey"
  });

  private async checks(indexed: string) {
    const index = this.client.index(indexed);
    const sorts = ["popularity", "vote_average", "vote_count"];
    const sort = await index.getSortableAttributes();
    if (!sorts.every(attr => sort.includes(attr))) {
      await index.updateSortableAttributes(sorts);
    }
  }

  async movies(filter: string, sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    await this.checks("movies");
    return await this.client.index('movies').search(filter, {
      sort: [`${sort_by}:desc`],
      hitsPerPage,
      page
    });
  }

  async tv(filter: string, sort_by: string = "popularity", page: number = 1, hitsPerPage: number = 20) {
    await this.checks("tv");
    return await this.client.index('tv').search(filter, {
      sort: [`${sort_by}:desc`],
      hitsPerPage,
      page
    });
  }

  async people(filter: string, sort_by: string, page: number = 1, hitsPerPage: number = 20) {
    await this.checks("people");
    return await this.client.index('people').search(filter, {
      sort: [`${sort_by}:desc`],
      hitsPerPage,
      page
    });
  }
}
