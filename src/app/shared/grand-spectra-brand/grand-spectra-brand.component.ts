// grand-spectra-brand.component.ts
import {Component, computed, HostListener, signal} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-grand-spectra-brand',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './grand-spectra-brand.component.html',
  styleUrls: ['./grand-spectra-brand.component.scss']
})
export class GrandSpectraBrandComponent {
  windowWidth = signal(window.innerWidth);

  title = computed(() =>
    this.windowWidth() > 1100 ? 'GRAND SPECTRA' : 'GS'
  );

  @HostListener('window:resize')
  handleResize() {
    this.windowWidth.set(window.innerWidth);
  }
}
