import { Component, Input } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {


  @Input() lat!: number;
  @Input() lng!: number;
  @Input() canTouch!: boolean;


  ngOnInit(){
    this.loadMap();
  }
  loadMap(){
    this.center = {
      lat: this.lat,
      lng: this.lng
    };
    if(this.isMarked){
      this.markerPositiom = {
        lat: this.lat,
        lng: this.lng
      }
    }
  }

  zoom = 7; // Initial zoom level for the map
  center: google.maps.LatLngLiteral = {
    lat: 42.877,
    lng: 25.319
  };

  isMarked = true;
  markerPositiom = {
    lat: 0,
    lng: 0
  }

  // Method to handle map click event and update the display property
  setMarker(event: google.maps.MapMouseEvent) {
    this.isMarked = true;
    if (event.latLng != null) {
      this.markerPositiom = event.latLng.toJSON();
    }
  }
}
export interface Marker {
  lat: number,
  lng: number
}