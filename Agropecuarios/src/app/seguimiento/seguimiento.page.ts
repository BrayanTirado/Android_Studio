import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonList, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonDatetime
} from '@ionic/angular/standalone';

import { StorageService } from '../services/storage';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonTextarea, IonButton, IonList, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonDatetime
  ]
})
export class SeguimientoPage implements OnInit {

  // Controla qué vista se está mostrando
  vistaActual: 'info' | 'historial' | 'nuevo' | 'detalle' = 'info';

  // Último registro ingresado
  ultimo: any = null;

  // Historial con registros (cargado desde Local Storage)
  historial: any[] = [];

  // Registro seleccionado para detalle
  registroDetalle: any = null;

  // Formulario
  form = {
    accion: '',
    responsable: '',
    fechaIntervencion: '',
    resultados: '',
    proximaRevision: ''
  };

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {
    this.loadSeguimientoData();
  }

  loadSeguimientoData() {
    this.historial = this.storageService.getSeguimientoRecords();
    this.ultimo = this.historial.length > 0 ? this.historial[0] : null;
  }

  // Navegación
  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Abrir vista de nuevo registro
  nuevoRegistro() {
    this.vistaActual = 'nuevo';
    this.form = {
      accion: '',
      responsable: '',
      fechaIntervencion: '',
      resultados: '',
      proximaRevision: ''
    };
  }

  verHistorial() {
    this.vistaActual = 'historial';
  }

  volverInfo() {
    this.vistaActual = 'info';
  }

  // Abrir detalle
  verDetalle(registro: any) {
    this.registroDetalle = registro;
    this.vistaActual = 'detalle';
  }

  // Guardar registro
  guardar() {
    if (!this.form.accion || !this.form.responsable) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const nuevo = {
      ...this.form,
      fechaIntervencion: this.form.fechaIntervencion || new Date().toISOString().split('T')[0],
      proximaRevision: this.form.proximaRevision || ''
    };

    // Guardar en Local Storage
    this.storageService.addSeguimientoRecord(nuevo);

    // Recargar datos
    this.loadSeguimientoData();

    alert('Seguimiento registrado correctamente.');
    this.vistaActual = 'info';
  }

  cancelar() {
    this.vistaActual = 'info';
  }
}