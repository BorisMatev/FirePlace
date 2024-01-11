import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder,Validators  } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../core/servises/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
            FormsModule,
            ButtonModule,
            InputTextModule,
            RouterLink
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private fb: FormBuilder,
              private user: UserService) { }

  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });

  onSubmit(){
    const body = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.user.login(body).subscribe({
      next: (resp) => {
        if (resp !== null) {
          localStorage.setItem('token',JSON.stringify(resp));
        }
      },
      error: (error) => console.log(error)
    });
  }
}
