// sign.component.ts
import {Component, OnChanges, signal, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {ProgressSpinnerComponent} from '../../shared/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, ProgressSpinnerComponent],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent {
  signForm: FormGroup;
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isLoading = false;
  signError = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private backend: BackendService,
  ) {
    this.signForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });

    this.signForm.valueChanges.subscribe(() => {
      this.signError.set("")
    })
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }


  onSubmit() {
    this.isLoading = true;
    if (this.signForm.valid) {
      this.backend.login(this.signForm.value).then(result => {
        if (result) {
          this.router.navigate(['/profile']);
        } else {
          this.signError.set('Invalid credentials');
        }
        this.isLoading = false;
      })

    } else {
      this.signForm.markAllAsTouched();
      this.isLoading = false;
    }
  }
}
