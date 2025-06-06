import {Component, effect, EventEmitter, Input, Output, WritableSignal} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ]
})
export class SelectMenuComponent implements ControlValueAccessor {
  @Input({required: true}) options: { label: string; value: any }[] = [];
  @Input({required: true}) value!: WritableSignal<any>;
  @Input() placeholder = 'Seleccionar...';
  @Input() disabled = false;
  @Input() label?: string;
  @Output() selectionChange = new EventEmitter<any>();

  // Valor interno para el ControlValueAccessor
  private _internalValue: any;

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor() {
    // Efecto para sincronizar cambios del signal al componente
    effect(() => {
      if (this.value) {
        this._internalValue = this.value();
        // Notificar al formulario sobre el cambio
        this.onChange(this._internalValue);
      }
    });
  }

  get internalValue(): any {
    return this._internalValue;
  }

  set internalValue(val: any) {
    this._internalValue = val;

    // Actualizar el signal cuando cambia el valor interno
    if (this.value && this.value() !== val) {
      this.value.set(val);
    }

    this.onChange(val);
    this.onTouched();
  }

  writeValue(value: any): void {
    // Cuando el formulario actualiza el valor
    if (value !== undefined && value !== this._internalValue) {
      this._internalValue = value;

      // Actualizar el signal si es diferente
      if (this.value && this.value() !== value) {
        this.value.set(value);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.internalValue = selectElement.value;
    this.selectionChange.emit(this.internalValue);
  }

  getSelectedLabel(): string {
    if (!this.internalValue) return this.placeholder;
    const option = this.options.find(opt => opt.value === this.internalValue);
    return option ? option.label : this.placeholder;
  }
}
