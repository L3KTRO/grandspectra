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
  animate
} from '@angular/animations';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dialogAnim', [
      transition(':enter', [
        style({opacity: 0, transform: 'scale(0.95)'}),
        animate('200ms ease-out', style({opacity: 1, transform: 'scale(1)'}))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({opacity: 0, transform: 'scale(0.95)'}))
      ])
    ])
  ]
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  visible = signal(false)
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
    this.dialogRef.nativeElement.removeEventListener('click', this.close);
  }

  open() {
    this.visible.set(true);
    this.dialogRef.nativeElement.showModal();
    const root = document.querySelector('html') as HTMLElement;
    if (root) root.style.overflow = 'hidden';
  }

  close() {
    this.visible.set(false);
    this.dialogRef.nativeElement.close();
    this.closed.emit();

    const root = document.querySelector('html') as HTMLElement;
    if (root) root.style.overflow = '';
  }
}
