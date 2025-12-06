import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import exifr from 'exifr'; // Librería para leer GPS de fotos subidas

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, CommonModule]
})
export class HomePage {

  // Variables para la cámara / imagen
  imageUrl: string | undefined;

  // Variables para la ubicación
  latitude: number | undefined;
  longitude: number | undefined;
  googleMapsUrl: string | undefined;

  // Mostrar coordenadas solo al hacer clic en enlace
  showCoords: boolean = false;

  // Variable para controlar si ya se intentó obtener ubicación
  locationChecked: boolean = false;

  constructor(private alertCtrl: AlertController) {}

  // --- MÉTODO PARA ELEGIR CÁMARA O GALERÍA ---
  async takePhoto() {
    const alert = await this.alertCtrl.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Cámara',
          handler: async () => {
            await alert.dismiss();
            await this.getPhoto(CameraSource.Camera);
            await this.getLocationFromCamera();
            this.showCoords = false;
          }
        },
        {
          text: 'Galería',
          handler: async () => {
            await this.getPhoto(CameraSource.Photos);
            await this.getLocationFromFile();
            this.showCoords = false;
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  // --- MÉTODO PARA VOLVER A TOMAR FOTO ---
  async retakePhoto() {
    this.imageUrl = undefined;
    this.latitude = undefined;
    this.longitude = undefined;
    this.googleMapsUrl = undefined;
    this.showCoords = false;
    this.locationChecked = false;

    await this.takePhoto(); // Lanza nuevamente el alert
  }

  // --- MÉTODO PRIVADO PARA OBTENER FOTO ---
  private async getPhoto(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source
      });

      if (image.webPath) {
        this.imageUrl = image.webPath;
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  // --- OBTENER UBICACIÓN REAL DESDE LA CÁMARA ---
  private async getLocationFromCamera() {
    this.locationChecked = false;
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.googleMapsUrl = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
    } catch (error) {
      console.error('Error al obtener ubicación desde cámara:', error);
      this.googleMapsUrl = undefined;
    } finally {
      this.locationChecked = true;
    }
  }

  // --- OBTENER UBICACIÓN DESDE UNA FOTO SUBIDA (EXIF) ---
  private async getLocationFromFile() {
    this.locationChecked = false;
    if (!this.imageUrl) return;

    try {
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'uploaded-photo.jpg', { type: blob.type });

      const gps = await exifr.gps(file);

      if (gps) {
        this.latitude = gps.latitude;
        this.longitude = gps.longitude;
        this.googleMapsUrl = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
      } else {
        this.latitude = undefined;
        this.longitude = undefined;
        this.googleMapsUrl = undefined;
        console.log('La foto no contiene ubicación GPS.');
      }

    } catch (error) {
      console.error('Error al leer ubicación de la foto:', error);
      this.latitude = undefined;
      this.longitude = undefined;
      this.googleMapsUrl = undefined;
    } finally {
      this.locationChecked = true;
    }
  }

  // --- MÉTODO PARA VOLVER AL HOME ---
  goHome() {
    this.imageUrl = undefined;
    this.latitude = undefined;
    this.longitude = undefined;
    this.googleMapsUrl = undefined;
    this.showCoords = false;
    this.locationChecked = false;
  }

  // --- MOSTRAR COORDENADAS AL HACER CLICK ---
  toggleCoords() {
    this.showCoords = !this.showCoords;
  }
}
