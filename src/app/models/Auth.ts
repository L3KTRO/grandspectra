import {User} from './User';

export interface Auth {
  user: User,
  access_token: string,
  token_type: string,
}
