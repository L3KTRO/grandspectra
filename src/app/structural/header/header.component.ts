// header.component.ts
import {Component, computed, HostListener, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {GrandSpectraBrandComponent} from '../../shared/grand-spectra-brand/grand-spectra-brand.component';
import {BackendService} from '../../services/backend/backend.service';
import {SyncStore} from '../../stores/SyncStore';
import {computedResource} from '../../helpers/Resources';
import {Me} from '../../models/Me';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, GrandSpectraBrandComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(public syncStore: SyncStore) {
    this.initialSync.set(syncStore.loginSync())
  }

  initialSync = signal(0)
  isMenuOpen = signal(false);
  backendService = inject(BackendService);

  me = computedResource<Me>({
    request: () => ({
      sync: this.syncStore.loginSync()
    }),
    loader: async () => {
      console.log("header refresh")
      const req = await this.backendService.getMe();
      if (req.status === 200) {
        return req.data;
      } else {
        return null;
      }
    }
  })

  windowWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    this.windowWidth.set(target.innerWidth);
  }

  ngOnInit() {
    this.windowWidth.set(window.innerWidth);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  togglerMenu(signal: WritableSignal<boolean>) {
    if (this.windowWidth() <= 725) signal.update(value => !value);
  }

}
