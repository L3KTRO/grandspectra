import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @Input() dialogTitle = '';
  @Output() closed = new EventEmitter<void>();
  @ViewChild('dialog', {static: true}) dialogRef!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit() {
    this.dialogRef.nativeElement.showModal();

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
    this.dialogRef.nativeElement.showModal();
    const root = document.querySelector('html') as HTMLElement;
    if (root) root.style.overflow = 'hidden';
  }

  close() {
    this.dialogRef.nativeElement.close();
    this.closed.emit();

    const root = document.querySelector('html') as HTMLElement;
    if (root) root.style.overflow = '';
  }
}
