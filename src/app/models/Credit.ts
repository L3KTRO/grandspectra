import Person from './Person';
import {Occupation} from './Occupation';
import {Tv} from './Tv';
import {Movie} from './Movie';

interface Credit {
  id: number;
  person: Person;
  movie_id: number | null;
  tv_id: number | null;
  occupation: Occupation;
  occupation_id: number | null;
  order: number | null;
  character: string | null;
  tv: Tv | null;
  movie: Movie | null;
}

export default Credit;
