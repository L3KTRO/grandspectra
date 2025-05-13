import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output, signal,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dialogAnimation', [
      // Estado inicial/cerrado
      state('closed', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      // Estado abierto
      state('open', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      // Transición de cerrado a abierto (entrada)
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      // Transición de abierto a cerrado (salida)
      transition('open => closed', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('maskAnimation', [
      // Estado inicial/cerrado
      state('closed', style({
        opacity: 0
      })),
      // Estado abierto
      state('open', style({
        opacity: 1
      })),
      // Transición de cerrado a abierto (entrada)
      transition('closed => open', [
        style({opacity: 1}),
        animate('300ms ease-out')
      ]),
      // Transición de abierto a cerrado (salida)
      transition('open => closed', [
        style({opacity: 0}),
        animate('200ms ease-in')
      ])
    ]),
  ]

})
export class DialogComponent implements AfterViewInit, OnDestroy {
  dialogState = signal('closed');
  @Input() dialogTitle = '';
  @Output() closed = new EventEmitter<void>();
  @ViewChild('dialog', {static: true}) dialogRef!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit() {
    //this.dialogRef.nativeElement.showModal(); //TODO: remove this line

    this.dialogRef.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const rect = this.dialogRef.nativeElement.getBoundingClientRect();
      const isOutside =
        event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom;

      if (isOutside) {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    const root = document.querySelector('html') as HTMLElement;
    if (root) root.style.overflow = 'auto';
    this.dialogRef.nativeElement.removeEventListener('click', this.close);
  }

  open() {
    this.dialogState.set('open');
    this.dialogRef.nativeElement.showModal();
    const root = document.querySelector('html') as HTMLElement;
    if (root) root.style.overflow = 'hidden';
  }

  close() {
    this.dialogState.set('closed');
  }

  onAnimationDone() {
    // Si terminó la animación de cierre, cerramos el diálogo
    if (this.dialogState() === 'closed') {
      this.dialogRef.nativeElement.close();
      this.closed.emit();

      const root = document.querySelector('html') as HTMLElement;
      if (root) root.style.overflow = '';
    }
  }

  protected readonly event = event;
}
