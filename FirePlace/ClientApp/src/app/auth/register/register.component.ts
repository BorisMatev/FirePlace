import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';

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

  constructor(private fb: FormBuilder) {

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
    // const body = {
    //   image : this.registerForm.get('image')?.value,
    //   username: this.registerForm.get('username')?.value,
    //   info: this.registerForm.get('info')?.value,
    //   email: this.registerForm.get('email')?.value,
    //   password: this.registerForm.get('password')?.value
    // }
    const body = this.registerForm.getRawValue();
    console.log(body);
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
