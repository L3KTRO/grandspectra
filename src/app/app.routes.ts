import {Routes} from '@angular/router';


import {authGuard} from './auth/auth.guard';


import {noAuthGuard} from './auth/no-auth.guard';

export const routes: Routes = [
  {
    path: "", loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: "hub", loadComponent: () => import('./pages/hub/hub.component').then(m => m.HubComponent)
  },
  {
    path: "movie/:id", loadComponent: () => import('./pages/movie/movie.component').then(m => m.MovieComponent)
  },
  {
    path: "tv/:id", loadComponent: () => import('./pages/tv/tv.component').then(m => m.TvComponent)
  },
  {
    path: "person/:id", loadComponent: () => import('./pages/person/person.component').then(m => m.PersonComponent)
  },
  {
    path: "profile",
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: "login",
    loadComponent: () => import('./pages/sign/sign.component').then(m => m.SignComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: "list/create",
    loadComponent: () => import('./pages/list-creator/list-creator.component').then(m => m.ListCreatorComponent),
    canActivate: [authGuard]
  },
  {
    path: "list/:id", loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent)
  },
  {
    path: "lists", loadComponent: () => import('./pages/lists/lists.component').then(m => m.ListsComponent)
  },
  {
    path: "spectators",
    loadComponent: () => import('./pages/spectators/spectators.component').then(m => m.SpectatorsComponent)
  }
];
