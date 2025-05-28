import {Movie} from './Movie';
import {User} from './User';
import {Tv} from './Tv';
import {Vote} from './Vote';

export interface ContentList {
  id: number,
  name: string,
  description: string,
  public: boolean,
  movie: Array<Movie>,
  tv: Array<Tv>,
  created_at: Date,
  updated_at: Date,
  user: User,
  votes: Vote[]
}
