import {Content} from './Content';

export interface Movie extends Content {
  title: string;
  title_sort: string;
  original_title: string | null;
  adult: boolean | null;
  budget: string | null;
  release_date: Date | null;
  revenue: string | null;
  runtime: string | null;
  tagline: string | null;
}
