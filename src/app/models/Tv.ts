import {Content} from './Content';

export interface Tv extends Content {
  tvdb_id: string | null;
  type: string | null;
  name: string;
  name_sort: string;
  original_name: string | null;
  number_of_episodes: number | null;
  count_existing_episodes: number | null;
  count_total_episodes: number | null;
  number_of_seasons: number | null;
  episode_run_time: string | null;
  first_air_date: Date | null;
  in_production: boolean | null;
  last_air_date: Date | null;
  next_episode_to_air: Date | null;
  origin_country: string | null;
}
