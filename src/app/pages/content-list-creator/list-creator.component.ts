import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BackendService} from '../../services/backend/backend.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-content-list-creator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './list-creator.component.html',
  styleUrl: './list-creator.component.scss'
})
export class ListCreatorComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private backend: BackendService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      public: ["false", Validators.required],
    });
  }

  onSubmit() {
    if (!this.form.invalid) {
      console.log("correcto")
      console.log(this.form.value)
    }
  }
}
