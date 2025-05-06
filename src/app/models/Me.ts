import {User} from './User';
import {UserAndContent} from './UserAndContent';

export interface Me extends User {
  watched: Array<UserAndContent>;
  watchlist: Array<UserAndContent>;
  ratings: Array<UserAndContent>;
  followers: Array<User>;
  following: Array<User>;
}
