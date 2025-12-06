import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonTextarea, IonInput, IonButton, IonDatetime, IonDatetimeButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.page.html',
  styleUrls: ['./riesgos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonTextarea, IonInput, IonButton, IonDatetime, IonDatetimeButton
  ]
})
export class RiesgosPage {

  constructor(private router: Router) {}

  // CAMPOS DEL FORMULARIO

  // CAMPOS DEL FORMULARIO
  form = {
    tipo: '',
    severidad: '',
    descripcion: '',
    area: 0,
    departamento: '',
    municipio: '',
    lote: '',
    coordenadas: '',
    fecha: ''
  };

  departamentos = [
    "Antioquia", "Cundinamarca", "Valle del Cauca", "Tolima", "Huila",
    "Meta", "Santander", "Boyacá", "Córdoba"
  ];

  municipios: any = {
    Antioquia: ["Medellín", "Envigado", "Bello"],
    Cundinamarca: ["Bogotá", "Soacha", "Chía"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
    Tolima: ["Ibagué", "Espinal", "Melgar"],
    Huila: ["Neiva", "Pitalito"],
    Meta: ["Villavicencio", "Acacías"],
    Santander: ["Bucaramanga", "Girón"],
    Boyacá: ["Tunja", "Duitama"],
    Córdoba: ["Montería", "Sahagún"]
  };

  municipiosFiltrados: string[] = [];

  ngDoCheck() {
    this.municipiosFiltrados = this.municipios[this.form.departamento] || [];
  }

  guardar() {
    console.log('Datos del riesgo:', this.form);

    if (!this.form.tipo || !this.form.severidad || !this.form.descripcion || !this.form.departamento) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    alert('Riesgo registrado correctamente.');
    this.router.navigate(['/riesgos-info']);
  }

  cancelar() {
    this.router.navigate(['/riesgos-info']);
  }

}
