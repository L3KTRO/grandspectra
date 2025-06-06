import {UserAndContent} from './UserAndContent';
import {User} from './User';

export interface Review extends UserAndContent {
  content: string | null;
  user: User;
}
