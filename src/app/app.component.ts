import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './structural/header/header.component';
import {FooterComponent} from './structural/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
