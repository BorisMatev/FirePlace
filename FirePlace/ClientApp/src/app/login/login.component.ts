import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder,Validators  } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../core/servises/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
            FormsModule,
            ButtonModule,
            InputTextModule
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
    console.log(body);
    this.user.login(body).subscribe({
      next: (resp) => console.log(resp),
      error: (error) => console.log(error)
    });
  }
}
