import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../core/servises/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RouterLink,
    InputTextareaModule,
    PasswordModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder,
              private user: UserService) {

  }
  img!: string;

  registerForm = this.fb.group({
    image: ['',Validators.maxLength(20)],
    username: [''],
    info: [''],
    email: [''],
    password: [''], 
    confPassword: ['']
  });

  onSubmit(){
    const body = this.registerForm.getRawValue();
    this.user.register(body).subscribe({
      next: resp => console.log(resp),
      error: error => console.log(error)
    });
  }

  onFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      this.img= base64String;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
