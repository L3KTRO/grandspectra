import Credit from './Credit';

interface Person {
  id: number;
  name: string;
  imdb_id: string | null;
  known_for_department: string | null;
  place_of_birth: string | null;
  popularity: number;
  profile: string | null;
  still: string | null;
  adult: string | null;
  also_known_as: string | null;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  homepage: string | null;
  credits: Credit[];
}

export default Person;
