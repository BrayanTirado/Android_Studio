import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonButton, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime,
  IonSelect, IonSelectOption, IonList
} from '@ionic/angular/standalone';

import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-riesgos-info',
  templateUrl: './riesgos-info.page.html',
  styleUrls: ['./riesgos-info.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonButton, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime,
    IonSelect, IonSelectOption, IonList
  ]
})
export class RiesgosInfoPage implements OnInit, AfterViewInit {
  @ViewChild('riesgosChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Controla qué vista se está mostrando
  vistaActual: 'info' | 'historial' | 'nuevo' | 'detalle' = 'info';

  // Registro seleccionado para detalle

  // Último registro ingresado
  ultimo: any = null;

  // Historial con registros de ejemplo
  historial = [
    { tipo: 'Climático', nivel: 'Alto', fecha: '2025-11-26', descripcion: 'Humedad excesiva en Zona A', area: 50, departamento: 'Antioquia', municipio: 'Medellín', lote: 'Lote 1', coordenadas: '6.2442, -75.5812' },
    { tipo: 'Plagas', nivel: 'Medio', fecha: '2025-11-20', descripcion: 'Plaga detectada en lote 2', area: 20, departamento: 'Cundinamarca', municipio: 'Soacha', lote: 'Lote 2', coordenadas: '4.5791, -74.1852' },
    { tipo: 'Suelos', nivel: 'Bajo', fecha: '2025-11-18', descripcion: 'Riesgo controlado de maleza', area: 10, departamento: 'Valle del Cauca', municipio: 'Cali', lote: 'Lote 3', coordenadas: '3.4516, -76.5320' }
  ];

  // Registro seleccionado para detalle
  registroDetalle: any = null;

  // Formulario
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

  // Listas de ubicaciones
  departamentos = ["Antioquia", "Cundinamarca", "Valle del Cauca", "Tolima", "Huila", "Meta", "Santander", "Boyacá", "Córdoba"];
  
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.ultimo = this.historial[0];
  }

  ngAfterViewInit() {
    this.renderRiesgosChart();
  }

  renderRiesgosChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Agrupar riesgos por departamento y mostrar severidad real
    const departamentoStats: { [departamento: string]: { [severidad: string]: number } } = {};

    this.historial.forEach((riesgo: any) => {
      const departamento = riesgo.departamento || 'Sin departamento';
      const severidad = riesgo.nivel || 'bajo'; // Usando 'nivel' que es el campo real

      if (!departamentoStats[departamento]) {
        departamentoStats[departamento] = { 'bajo': 0, 'moderado': 0, 'alto': 0, 'critico': 0 };
      }

      // Normalizar severidad
      let sevNormalizada = 'bajo';
      if (severidad.toLowerCase().includes('critic')) sevNormalizada = 'critico';
      else if (severidad.toLowerCase().includes('alt')) sevNormalizada = 'alto';
      else if (severidad.toLowerCase().includes('moderad')) sevNormalizada = 'moderado';

      departamentoStats[departamento][sevNormalizada]++;
    });

    // Si no hay datos, mostrar gráfico vacío
    if (Object.keys(departamentoStats).length === 0) {
      departamentoStats['Sin datos'] = { 'bajo': 1, 'moderado': 0, 'alto': 0, 'critico': 0 };
    }

    const labels = Object.keys(departamentoStats);
    const bajoData = labels.map(dep => departamentoStats[dep]['bajo']);
    const moderadoData = labels.map(dep => departamentoStats[dep]['moderado']);
    const altoData = labels.map(dep => departamentoStats[dep]['alto']);
    const criticoData = labels.map(dep => departamentoStats[dep]['critico']);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Bajo',
            data: bajoData,
            backgroundColor: 'rgba(34, 139, 34, 0.8)',
            borderColor: 'rgba(34, 139, 34, 1)',
            borderWidth: 1,
            stack: 'severidad'
          },
          {
            label: 'Moderado',
            data: moderadoData,
            backgroundColor: 'rgba(255, 165, 0, 0.8)',
            borderColor: 'rgba(255, 165, 0, 1)',
            borderWidth: 1,
            stack: 'severidad'
          },
          {
            label: 'Alto',
            data: altoData,
            backgroundColor: 'rgba(255, 140, 0, 0.8)',
            borderColor: 'rgba(255, 140, 0, 1)',
            borderWidth: 1,
            stack: 'severidad'
          },
          {
            label: 'Crítico',
            data: criticoData,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
            stack: 'severidad'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Departamentos'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Número de Riesgos'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            title: {
              display: true,
              text: 'Severidad'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const departamento = context.label || '';
                const severidad = context.dataset.label || '';
                const cantidad = context.parsed.y || 0;
                return `${departamento} - ${severidad}: ${cantidad} riesgo(s)`;
              }
            }
          }
        }
      }
    });
  }

  // Navegación
  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Abrir vista de nuevo registro
  nuevoRegistro() {
    this.vistaActual = 'nuevo';
    this.form = { 
      tipo: '', severidad: '', descripcion: '', area: 0, 
      departamento: '', municipio: '', lote: '', coordenadas: '', fecha: '' 
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
    if (!this.form.tipo || !this.form.severidad || !this.form.descripcion || !this.form.departamento) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const nuevo = {
      tipo: this.form.tipo,
      nivel: this.form.severidad,
      fecha: this.form.fecha || 'Sin fecha',
      descripcion: this.form.descripcion,
      area: this.form.area,
      departamento: this.form.departamento,
      municipio: this.form.municipio,
      lote: this.form.lote,
      coordenadas: this.form.coordenadas
    };

    this.historial.unshift(nuevo);
    this.ultimo = nuevo;

    // Actualizar el gráfico con los nuevos datos
    setTimeout(() => {
      this.renderRiesgosChart();
    }, 100);

    alert('Riesgo registrado correctamente.');
    this.vistaActual = 'info';
  }

  cancelar() {
    this.vistaActual = 'info';
  }


  // Actualizar municipios según departamento
  ngDoCheck() {
    this.municipiosFiltrados = this.municipios[this.form.departamento] || [];
  }
}
