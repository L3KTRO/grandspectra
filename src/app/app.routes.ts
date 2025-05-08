import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {HubComponent} from './pages/hub/hub.component';
import {MovieComponent} from './pages/movie/movie.component';
import {TvComponent} from './pages/tv/tv.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {SignComponent} from './pages/sign/sign.component';
import {PersonComponent} from './pages/person/person.component';
import {authGuard} from './auth/auth.guard';
import {ListCreatorComponent} from './pages/list-creator/list-creator.component';

export const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "hub", component: HubComponent
  },
  {
    path: "movie/:id", component: MovieComponent
  },
  {
    path: "tv/:id", component: TvComponent
  },
  {
    path: "person/:id", component: PersonComponent
  },
  {
    path: "profile", component: ProfileComponent, canActivate: [authGuard]
  },
  {
    path: "login", component: SignComponent
  },
  {
    path: "list/create", component: ListCreatorComponent
  }
];
