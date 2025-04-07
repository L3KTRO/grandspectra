import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {HubComponent} from './pages/hub/hub.component';
import {MovieComponent} from './pages/movie/movie.component';

export const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "hub", component: HubComponent
  },
  {
    path: "movie/:id", component: MovieComponent
  }
];
