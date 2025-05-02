// sign.component.ts
import {Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {BackendService} from '../../services/backend/backend.service';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgOptimizedImage, NgIf],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent {
  signForm: FormGroup;
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isLoading = signal(false);
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
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    if (this.signForm.valid) {
      this.isLoading.set(true);
      this.signError.set('');

      this.backend.login(this.signForm.value).then(result => {
        if (result) {
          this.router.navigate(['/profile']);
        } else {
          this.signError.set('Invalid credentials');
        }
      })

    } else {
      this.signForm.markAllAsTouched();
    }
  }
}
