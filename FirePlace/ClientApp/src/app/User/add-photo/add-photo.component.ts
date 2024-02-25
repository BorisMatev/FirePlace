import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';

import { FormBuilder, FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

import { PhotoService } from '../../core/servises/photo.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [FormsModule, ChipModule, MapComponent,ToastModule],
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.scss',
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
        width: '60%'
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

  private photoServise = inject(PhotoService);
  private fb = inject(FormBuilder);
  // private message = inject(MessageService);

  addPhotoBtn = "right";
  info = "first";

  categoryInput: string = "";
  categories: any = [];
  categoryResponse: any = [];

  addLoc = false;

  form = this.fb.group({
    base64String: this.fb.control(''),
    lat: this.fb.control(0),
    lng: this.fb.control(0),
    categories: this.fb.array([])
  });

  constructor() {
    setTimeout(() => {
      this.addPhotoBtn = "left";
      this.info = "second"
    }, 0);
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

  getCat() {
    this.photoServise.getCategories(this.categoryInput).subscribe({
      next: resp => this.categoryResponse = resp,
      error: error => console.log(error)
    })
  }


  removeItem(index: any) {
    console.log(1)
    this.categories.slice(index, 1);
    console.log(this.categories)
  }

  addChip(item: any) {
    this.categoryResponse = [];
    this.categoryInput = ""
    if (this.categories.length >= 8) {
      return;
    }
    this.categories.push(item.name);
  }

  clearForm(){
    this.form.value.base64String =  '';
    this.form.value.lat = 0;
    this.form.value.lng = 0;
    this.form.value.categories = [];
  }
  save(){
    this.form.value.categories = this.categories;
    const body = {
      base64String: this.form.value.base64String,
      lat: this.form.value.lat,
      lng: this.form.value.lng,
      categories: this.form.value.categories
    };
    this.photoServise.addPhoto(body)
    .subscribe({
      next: resp => console.log(resp),
      error: error => console.log(error),
    });
    // this.message.add({ severity: 'success', summary: 'Successasdasd', detail: 'Message asdadsContent' });
  }
}

export interface Photo {
  base64String: string,
  lat: number,
  lng: number,
  categories: string[]
}
