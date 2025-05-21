export interface Recommendation {
  first_air_date: string | null;
  id: number;
  movie_id: number | null;
  poster: string;
  recommendation_movie_id: number | null;
  recommendation_tv_id: number | null;
  release_date: string | null;
  title: string;
  tv_id: number | null;
  vote_average: string;
}
