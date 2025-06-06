import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component, DoCheck, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-dummy',
  imports: [],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.scss'
})
export class DummyComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked, AfterContentInit, AfterContentChecked, DoCheck, OnChanges {

  constructor() {
    console.log('Constructor: El componente se está construyendo');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: Se detectaron cambios en las propiedades de entrada', changes);
  }

  ngOnInit(): void {
    console.log('ngOnInit: El componente se inicializó');
    setTimeout(() => {
      return true
    }, 2000);
  }

  ngDoCheck(): void {
    console.log('ngDoCheck: Se ejecutó la detección de cambios personalizada');
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit: El contenido proyectado se inicializó');
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked: El contenido proyectado fue verificado');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: Las vistas del componente se inicializaron');
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked: Las vistas del componente fueron verificadas');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy: El componente se está destruyendo');
  }
}
