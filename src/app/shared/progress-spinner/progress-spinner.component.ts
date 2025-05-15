// spinner.component.ts
import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgressSpinnerComponent {
  @Input() size: number = 50;
}
