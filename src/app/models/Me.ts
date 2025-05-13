import {User} from './User';
import {UserAndContent} from './UserAndContent';
import {ContentList} from './ContentList';
import {Review} from './Review';

export interface Me extends User {
  watched: Array<UserAndContent>;
  watchlist: Array<UserAndContent>;
  ratings: Array<UserAndContent>;
  followers: Array<User>;
  following: Array<User>;
  content_lists: ContentList[];
  content_lists_saved: ContentList[];
  reviews: Array<Review>;
}
