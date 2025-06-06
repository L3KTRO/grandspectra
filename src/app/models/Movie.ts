import {Content} from './Content';
import {Genre} from './Genre';
import {Company} from './Company';

export interface Movie extends Content {
  title: string;
  title_sort: string;
  tagline: string | null;
  original_title: string | null;
  adult: boolean | null;
  budget: string | null;
  release_date: Date | null;
  revenue: string | null;
  runtime: string | null;
  genres: Genre[];
  companies: Company[];
  recommendations: Movie[];
}
