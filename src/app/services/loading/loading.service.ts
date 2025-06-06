import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private requestsCounter = 0;
  private timeoutId: any = null;

  show(): void {
    // Cancela cualquier timeout pendiente
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.requestsCounter++;
    if (this.requestsCounter === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.requestsCounter--;

    if (this.requestsCounter <= 0) {
      // Añade un pequeño retraso para evitar parpadeos en peticiones rápidas
      this.timeoutId = setTimeout(() => {
        this.requestsCounter = 0;
        this.loadingSubject.next(false);
        this.timeoutId = null;
      }, 300);
    }
  }

  // Método de emergencia para resetear en caso de problemas
  forceReset(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.requestsCounter = 0;
    this.loadingSubject.next(false);
  }
}
