// sign.component.ts
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {BackendService} from '../../services/backend/backend.service';
import {ProgressSpinnerComponent} from '../../shared/progress-spinner/progress-spinner.component';
import {toggler} from '../../helpers/Toggler';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, ProgressSpinnerComponent],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignComponent {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  formActive = computed(() => this.signUp() ? this.signUpForm : this.signInForm);
  signUp = signal(false)
  showPassword = signal(false);
  isLoading = signal(false);
  signError = signal('');

  constructor(private router: Router, private backend: BackendService, private fb: FormBuilder) {
    const email = ["", [Validators.required, Validators.email]]
    const password = ["", [Validators.required, Validators.minLength(6)]]

    this.signInForm = this.fb.group({
      email,
      password,
    });

    this.signUpForm = this.fb.group({
      email,
      password,
      username: ["", [Validators.required, Validators.minLength(5), Validators.pattern('^[a-z0-9]+$'), Validators.maxLength(20)]],
      confirmPassword: ["", [Validators.required, (control: {
        parent: { get: (arg0: string) => { (): any; new(): any; value: any; }; };
        value: any;
      }) => control.parent && control.value !== control.parent.get('password')?.value ? {notMatching: true} : null]],
    });
  }


  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }


  onSubmit() {
    this.isLoading.set(true);
    if (this.signUp()) {
      this.backend.login(this.signInForm.value).then(result => {
        if (result) {
          this.router.navigate([`/spectator/${result.user.username}`]);
        } else {
          this.signError.set('Invalid credentials');
        }
        this.isLoading.set(false);
      })
    } else {
      if (this.signInForm.valid) {
        this.backend.login(this.signInForm.value).then(result => {
          if (result) {
            this.router.navigate([`/spectator/${result.user.username}`]);
          } else {
            this.signError.set('Invalid credentials');
          }
          this.isLoading.set(false);
        })
      } else {
        this.signInForm.markAllAsTouched();
        this.isLoading.set(false);
      }
    }
  }

  protected readonly toggler = toggler;
}
