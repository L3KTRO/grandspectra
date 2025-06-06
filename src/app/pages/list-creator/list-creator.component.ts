import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BackendService} from '../../services/backend/backend.service';
import {Location, NgIf} from '@angular/common';

@Component({
  selector: 'app-list-creator',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  providers: [Location],
  templateUrl: './list-creator.component.html',
  styleUrl: './list-creator.component.scss'
})
export class ListCreatorComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private backend: BackendService, private location: Location) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', Validators.required],
      public: ["true", Validators.required],
    });
  }

  onSubmit() {
    if (!this.form.invalid) {
      this.backend.authRequest("/lists", {
        method: "POST",
        data: {
          name: this.form.value.name,
          description: this.form.value.description,
          public: this.form.value.public === "true",
        }
      }).then((res) => {
        if (res.status === 201) {
          this.location.back();
        }
      })
    }
  }
}
