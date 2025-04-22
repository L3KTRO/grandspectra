// sign.component.ts
import {Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent {
  signForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  signError = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.signForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    if (this.signForm.valid) {
      this.isLoading.set(true);
      this.signError.set('');

      // Aquí iría la lógica de autenticación
      // Por ejemplo, un servicio de autenticación que devuelva una promesa

      setTimeout(() => {
        // Simulando una respuesta del servidor
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      }, 1500);
    } else {
      this.signForm.markAllAsTouched();
    }
  }

  signWithGoogle() {
    this.isLoading.set(true);
    // Implementar lógica de autenticación con Google
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/home']);
    }, 1500);
  }
}
