import {Movie} from './Movie';
import {Tv} from './Tv';

export interface UserAndContent {
  id: number;
  movie: Movie | null;
  tv: Tv | null;
  tv_id: number | null;
  movie_id: number | null;
  qualification: number | null;
  updated_at: Date;
  created_at: Date;
}
