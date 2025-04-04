// header.component.ts
import {Component, computed, HostListener, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {GrandSpectraBrandComponent} from '../../shared/grand-spectra-brand/grand-spectra-brand.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, GrandSpectraBrandComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  windowWidth = signal(window.innerWidth);

  // Propiedades computadas
  hub = computed(() =>
    this.windowWidth() > 700 ? 'SPECTRA HUB' : 'HUB'
  );

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
