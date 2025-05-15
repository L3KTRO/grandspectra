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
import {ListComponent} from './pages/list/list.component';
import {ListsComponent} from './pages/lists/lists.component';
import {noAuthGuard} from './auth/no-auth.guard';

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
    path: "login", component: SignComponent, canActivate: [noAuthGuard]
  },
  {
    path: "list/create", component: ListCreatorComponent, canActivate: [authGuard]
  },
  {
    path: "list/:id", component: ListComponent
  },
  {
    path: "lists", component: ListsComponent
  }
];
