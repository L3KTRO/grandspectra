import {Movie} from './Movie';
import {User} from './User';

export interface ContentList {
  id: number,
  name: string,
  description: string,
  movie: Array<Movie>,
  tv: Array<Movie>,
  created_at: Date,
  updated_at: Date,
  user: User,
}
