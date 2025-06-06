import {effect, Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RequestUpdate {
  private readonly STORAGE_KEY = 'request_update_time';

  req = signal(this.getInitialValue());

  constructor() {
    // Effect para guardar automáticamente cuando cambie el signal
    effect(() => {
      const currentValue = this.req();
      localStorage.setItem(this.STORAGE_KEY, currentValue.toString());
    });
  }

  private getInitialValue(): number {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  addDelay() {
    this.req.set(Date.now() + 5 * 60 * 1000);
  }

  check() {
    return this.req() < Date.now();
  }

  // Método opcional para limpiar el storage
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.req.set(0);
  }
}
