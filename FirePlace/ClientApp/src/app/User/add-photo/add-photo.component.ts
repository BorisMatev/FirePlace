import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

import { PhotoService } from '../../core/services/photo.service';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [ 
            CommonModule,
            FormsModule, 
            MapComponent, 
            DropdownModule,
            InputTextareaModule,
            ReactiveFormsModule
          ],
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.scss',
  providers: [],
  animations: [
    trigger("onLoad", [
      state("first", style({
        opacity: 0,
        transform: 'scale(0.2)'
      })),
      state("second", style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state("right", style({
        transform: 'translateX(305%)',
        height: '210px',
        width: '210px',
        backgroundColor: 'var(--light-purple)',
        borderRadius: '330px'
      })),
      state("left", style({
        transform: 'translateX(0px)',
        backgroundColor: 'rgba(0, 0, 0, 0.502)',
        borderRadius: '20px',
        width: '75%'
      })),

      transition('right => *', [
        animate("1s", keyframes([
          style({
            transform: 'translateX(220%)',
            backgroundColor: 'var(--light-purple)',
            borderRadius: '330px',
            width: '210px',
            height: '210px',
            offset: 0
          }),
          style({
            transform: 'translateX(0%)',
            backgroundColor: 'rgba(123, 42, 78, 0.502)',
            borderRadius: '50px',
            width: '40%',
            offset: 0.7
          }),
          style({
            transform: 'translateX(0%)',
            backgroundColor: 'rgba(123, 42, 78, 0.502)',
            borderRadius: '50px',
            width: '50%',
            offset: 0.9
          }),
          style({
            backgroundColor: 'rgba(0, 0, 0, 0.502)',
            borderRadius: '20px',
            width: '60%',
            height: '50%',
            offset: 1
          })
        ]))
      ]),
      transition('first => second', animate('1s'))
    ])
  ]
})
export class AddPhotoComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private photoServise = inject(PhotoService);
  private messageService = inject(MessageService);

  addPhotoBtn = "right";
  info = "first";

  categoryInput: any = "";
  categories: any = [];

  allCategories: any = [];

  infoInput: string = '';
  addLoc = false;

  form = this.fb.group({
    base64String: ['', Validators.required],
    lat:[0, Validators.required],
    lng: [0, Validators.required],
    categories: [[], Validators.required],
  });

  constructor() {
    setTimeout(() => {
      this.addPhotoBtn = "left";
      this.info = "second"
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
