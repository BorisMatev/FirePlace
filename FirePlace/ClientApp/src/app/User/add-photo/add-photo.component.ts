import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';

import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';

import { PhotoService } from '../../core/servises/photo.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [FormsModule, ChipModule, MapComponent],
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

  addPhotoBtn = "right";
  info = "first";

  categoryInput: string = "";
  catrgories: any = [];
  categoryResponse: any = [];

  addLoc = false;

  form = this.fb.group({
    base64string: this.fb.control(''),
    lat: this.fb.control(0),
    lng: this.fb.control(0),
    catrgories: this.fb.array([])
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
      this.form.value.base64string = base64String;
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
    this.catrgories.slice(index, 1);
    console.log(this.catrgories)
  }

  addChip(item: any) {
    this.categoryResponse = [];
    this.categoryInput = ""
    if (this.catrgories.length >= 8) {
      return;
    }
    this.catrgories.push(item.name);
  }

  clearForm(){
    this.form.value.base64string =  '';
    this.form.value.lat = 0;
    this.form.value.lng = 0;
    this.form.value.catrgories = [];
  }
  save(){
    this.form.value.catrgories = this.catrgories;
    const body = {
      base64string: this.form.value.base64string,
      lat: this.form.value.lat,
      lng: this.form.value.lng,
      catrgories: this.form.value.catrgories
    };
    this.photoServise.addPhoto(body)
    .subscribe({
      next: resp => console.log(resp),
      error: error => console.log(error)
    });
  }
}

export interface Photo {
  base64String: string,
  lat: number,
  lng: number,
  categories: string[]
}
