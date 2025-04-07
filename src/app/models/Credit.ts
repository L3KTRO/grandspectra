import Person from './Person';
import {Occupation} from './Occupation';

interface Credit {
  id: number;
  person: Person;
  movie_id: number | null;
  tv_id: number | null;
  occupation: Occupation;
  occupation_id: number | null;
  order: number | null;
  character: string | null;
}

export default Credit;
