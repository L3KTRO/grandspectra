import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {filter, Subscription} from 'rxjs';
import {LoadingService} from './services/loading/loading.service';
import {HeaderComponent} from './structural/header/header.component';
import {ProgressSpinnerComponent} from './shared/progress-spinner/progress-spinner.component';
import {FooterComponent} from './structural/footer/footer.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    ProgressSpinnerComponent,
    RouterOutlet,
    FooterComponent,
    AsyncPipe
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(
    public loadingService: LoadingService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Restablece el estado de carga cuando cambia la ruta (medida de seguridad)
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe(() => {
        this.loadingService.forceReset();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
