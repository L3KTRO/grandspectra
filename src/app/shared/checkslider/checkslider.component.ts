import {Component, Input, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-checkslider',
  imports: [
    FormsModule
  ],
  templateUrl: './checkslider.component.html',
  styleUrl: './checkslider.component.scss'
})
export class ChecksliderComponent {
  @Input({required: true}) checked = signal<boolean>(false);
  @Input() enable = signal<boolean>(false);

}
