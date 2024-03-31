import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';

import { PhotoService } from '../../core/services/photo.service';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [ 
            CommonModule,
            FormsModule, 
            MapComponent, 
            DropdownModule,
            InputTextareaModule,
            ReactiveFormsModule,
            StepperModule,
            ButtonModule
          ],
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.scss',
  providers: [],
  animations: [
    trigger("onLoad", [
      state("first", style({
        opacity: 0,
        transform: 'translateY(100%)',
      })),
      state("second", style({
        opacity: 1,
        transform: 'translateY(0%)'
      })),
      transition('first => second', animate('0.8s'))
    ])
  ]
})
export class AddPhotoComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private photoServise = inject(PhotoService);
  private messageService = inject(MessageService);

  page = "first";
  progress: number = 1;

  categoryInput: any = "";
  categories: any = [];

  allCategories: any = [];

  infoInput: string = '';

  saveBtn: boolean = false;

  form = this.fb.group({
    base64String: ['', Validators.required],
    lat:[0, Validators.required],
    lng: [0, Validators.required],
    categories: [[], Validators.required],
  });

  constructor() {
    setTimeout(() => {
      this.page = "second"
    }, 0);
  }

  ngOnInit(){
    this.fetchCategories();
  }

  onFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      this.form.value.base64String = base64String;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  setCordinates(event: any) {
    this.form.value.lat = event.lat;
    this.form.value.lng = event.lng;
  }

  fetchCategories(): void {
    this.photoServise.getAllCategories().subscribe({
      next: resp => this.allCategories = resp,
      error: error => console.log(error)
    })
  }


  removeItem(index: any) {
    this.categories.splice(index, 1);
  }

  addChip() {
    if (this.categories.length >= 8) {
      return;
    }
    this.categories.push(this.categoryInput.name);
    this.categoryInput = ""
  }

  save(){
    this.form.value.categories = this.categories;
    const body = {
      info: this.infoInput,
      base64String: this.form.value.base64String,
      lat: this.form.value.lat,
      lng: this.form.value.lng,
      categories: this.form.value.categories
    };
    this.photoServise.addPhoto(body)
      .subscribe({
        next: () => {},
        complete: () => {
          this.successMesage();
          setTimeout(()=>{
            this.router.navigate(['/profile']);
          },1000)
        }
      });
  }

  successMesage() {
    this.messageService.add({ 
      key: 'toast', 
      severity: 'success', 
      summary: 'Успех', 
      detail: 'Снимката беше запазена успешно!' 
    });
  }
}
