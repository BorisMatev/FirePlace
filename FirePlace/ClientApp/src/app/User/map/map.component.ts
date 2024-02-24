import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {


  @Input() lat: number = 42.76606047364963;
  @Input() lng: number = 25.23841377705376;
  @Input() zoom!: number;
  @Input() canTouch!: boolean;
  @Input() canSeeMarker!: boolean;

  @Output() sendCordinates = new EventEmitter<Marker>();


  ngOnInit(){
    this.loadMap();
  }
  
  loadMap(){
    this.center = {
      lat: this.lat,
      lng: this.lng
    };
    if(this.canSeeMarker == true){
      console.log(1)
      this.markerPositiom = {
        lat: this.lat,
        lng: this.lng
      }
    }
  }

  center: google.maps.LatLngLiteral = {
    lat: 42.877,
    lng: 25.319
  };

  isMarked = false;
  markerPositiom = {
    lat: 0,
    lng: 0
  }

  // Method to handle map click event and update the display property
  setMarker(event: google.maps.MapMouseEvent) {
    this.isMarked = true;
    if (event.latLng != null && this.canTouch) {
      this.markerPositiom = event.latLng.toJSON();
    }
    this.sendCordinates.emit(this.markerPositiom);
  }
}
export interface Marker {
  lat: number,
  lng: number
}