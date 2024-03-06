import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../core/services/user.service';
import { FormErrorsComponent } from '../../core/shared/form-errors/form-errors.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RouterLink,
    InputTextareaModule,
    PasswordModule,
    FormErrorsComponent,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder,
              private user: UserService,
              private router: Router) {

  }
  img!: string;

  registerForm: any;

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      image: this.fb.control('', [Validators.required]),
      username: this.fb.control('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ]),
      info: this.fb.control('', [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(3)
      ]),
      email: this.fb.control('', [
        Validators.required,
        Validators.email
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&^_-]).{8,}$'),
        Validators.minLength(8)
      ]),
      confPassword: this.fb.control('', [
        Validators.required,
        Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&^_-]).{8,}$'),
        Validators.minLength(8),
        this.passwordMatchingValidator
      ])
    }, { validators: this.passwordMatchingValidator });
  }

  onSubmit() {
    // console.log(this.img)
    this.registerForm.value.image = this.img;
    console.log(this.registerForm.value.image)
    const body = {
      image: this.img,
      username: this.registerForm.get('username').value,
      info: this.registerForm.get('info').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value
    };
    this.user.register(body).subscribe({
      next: (resp) => {
        if (resp !== null) {
          localStorage.setItem('token',JSON.stringify(resp));
        }
      },
      error: error => console.log(error),
      complete: () => this.router.navigate(['/home'])
    });
  }

  onFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      this.registerForm.value.image = base64String;
      this.img = base64String
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }


  passwordMatchingValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const password = control.get("password");
    const confirmPassword = control.get("confPassword");

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({
        ...(confirmPassword.errors || {}),
        notmatched: true,
      });
    }

    // return null;
     return password?.value === confirmPassword?.value
       ? null
       : { notmatched: true };
  };
}
