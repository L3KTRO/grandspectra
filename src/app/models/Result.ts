export interface Result {
  id: number;
  title: string;
  name: string;
  _index: "tv" | "movies" | "people";
  poster: string;
  still: string;
  known_for_department?: string;
  episode_run_time?: number;
  release_date?: string;
  first_air_date?: string;
}
