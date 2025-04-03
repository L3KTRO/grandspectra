import {Tv} from './Tv';
import {Movie} from './Movie';

export interface Content {
  id: number;
  tmdb_id: string | null;
  imdb_id: string | null;
  status: string | null;
  overview: string | null;
  homepage: string | null;
  popularity: number | null;
  backdrop: string | null;
  poster: string | null;
  vote_average: string | null;
  vote_count: number | null;
  original_language: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  trailer: string | null;
}

export type ContentType<T extends boolean> = T extends true ? Tv : Movie;
