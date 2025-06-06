// header.component.ts
import {Component, computed, HostListener, inject, OnDestroy, OnInit, signal} from '@angular/core';
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
  windowWidth = signal(window.innerWidth);

  members = computed(() => {
    const width = this.windowWidth();
    return width > 700 ? 'SPECTATORS' : width > 650 ? 'SPECTATORS' : 'SPCTR';
  });

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
  }

  ngOnInit() {
    this.windowWidth.set(window.innerWidth);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}
