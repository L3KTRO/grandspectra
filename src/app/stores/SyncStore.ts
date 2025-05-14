import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SyncStore {
  profileSync = signal(0);
  loginSync = signal(0);

  addChangeProfile() {
    this.profileSync.update(value => value + 1);
  }

  addChangeLogin() {

    this.loginSync.update(value => value + 1);
  }
}
