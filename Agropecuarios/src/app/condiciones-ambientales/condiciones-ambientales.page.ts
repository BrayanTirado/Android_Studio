import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonList, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonDatetime
} from '@ionic/angular/standalone';

import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-condiciones-ambientales',
  templateUrl: './condiciones-ambientales.page.html',
  styleUrls: ['./condiciones-ambientales.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonTextarea, IonButton, IonList, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonDatetime
  ]
})
export class CondicionesAmbientalesPage implements OnInit, AfterViewInit {
  @ViewChild('ambientalChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  // Controla qué vista se está mostrando
  vistaActual: 'info' | 'historial' | 'nuevo' | 'detalle' = 'info';

  // Último registro ingresado
  ultimo: any = null;

  // Historial con registros
  historial = [
    // Ejemplo inicial
    {
      temperatura: 'templado',
      humedadAmbiente: 'media',
      viento: 'normal',
      clima: 'nublado',
      humedadSuelo: 'normal',
      texturaSuelo: 'normal',
      observacionesSuelo: 'Suelo en buen estado',
      fenologia: 'creciendo',
      fecha: '2025-11-26'
    }
  ];

  // Registro seleccionado para detalle
  registroDetalle: any = null;

  // Registro seleccionado para detalle

  // Formulario
  form = {
    temperatura: '',
    humedadAmbiente: '',
    viento: '',
    clima: '',
    humedadSuelo: '',
    texturaSuelo: '',
    observacionesSuelo: '',
    fenologia: '',
    fecha: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.ultimo = this.historial[0];
  }

  ngAfterViewInit() {
    this.renderAmbientalChart();
  }

  renderAmbientalChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Ordenar registros por fecha y tomar los últimos 8
    const registrosOrdenados = this.historial
      .filter((r: any) => r.fecha)
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 8);

    if (registrosOrdenados.length === 0) {
      this.renderEmptyAmbientalChart();
      return;
    }

    // Crear series temporales para cada variable
    const labels = registrosOrdenados.map((r: any, index: number) => {
      const fecha = new Date(r.fecha);
      return fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    });

    // Función para convertir valores cualitativos a numéricos
    const valorNumerico = (valor: string, tipo: string) => {
      switch (tipo) {
        case 'temperatura':
          switch (valor) {
            case 'frio': return 1;
            case 'templado': return 2;
            case 'caliente': return 3;
            default: return 2;
          }
        case 'humedadAmbiente':
          switch (valor) {
            case 'bajita': return 1;
            case 'media': return 2;
            case 'alta': return 3;
            default: return 2;
          }
        case 'clima':
          switch (valor) {
            case 'seco': return 1;
            case 'nublado': return 2;
            case 'lloviendo': return 3;
            case 'tormenta': return 4;
            default: return 2;
          }
        case 'humedadSuelo':
          switch (valor) {
            case 'seco': return 1;
            case 'normal': return 2;
            case 'mojado': return 3;
            case 'muy mojado': return 4;
            default: return 2;
          }
        case 'fenologia':
          switch (valor) {
            case 'chiquita': return 1;
            case 'creciendo': return 2;
            case 'grande': return 3;
            case 'lista': return 4;
            default: return 2;
          }
        default: return 1;
      }
    };

    const temperaturaData = registrosOrdenados.map((r: any) => valorNumerico(r.temperatura || 'templado', 'temperatura'));
    const humedadAmbData = registrosOrdenados.map((r: any) => valorNumerico(r.humedadAmbiente || 'media', 'humedadAmbiente'));
    const climaData = registrosOrdenados.map((r: any) => valorNumerico(r.clima || 'nublado', 'clima'));
    const humedadSueloData = registrosOrdenados.map((r: any) => valorNumerico(r.humedadSuelo || 'normal', 'humedadSuelo'));
    const fenologiaData = registrosOrdenados.map((r: any) => valorNumerico(r.fenologia || 'creciendo', 'fenologia'));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperatura',
            data: temperaturaData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Humedad Ambiente',
            data: humedadAmbData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Clima',
            data: climaData,
            borderColor: 'rgba(255, 205, 86, 1)',
            backgroundColor: 'rgba(255, 205, 86, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Humedad Suelo',
            data: humedadSueloData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Fenología',
            data: fenologiaData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha de Registro'
            }
          },
          y: {
            beginAtZero: true,
            max: 4.5,
            ticks: {
              callback: function(value) {
                const labels = ['', 'Bajo', 'Medio', 'Alto', 'Muy Alto/Crítico'];
                return labels[Number(value)] || value;
              }
            },
            title: {
              display: true,
              text: 'Nivel/Estado'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const registro = registrosOrdenados[index];
                const datasetLabel = context.dataset.label || '';
                const valorNumerico = context.parsed.y;
                const valorReal = this.getValorReal(datasetLabel, registro);

                return `${datasetLabel}: ${valorReal} (${valorNumerico})`;
              }
            }
          }
        }
      }
    });
  }

  renderEmptyAmbientalChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sin datos ambientales'],
        datasets: [{
          label: 'No hay registros',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.8)',
          borderColor: 'rgba(200, 200, 200, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 1
          }
        },
        plugins: {
          legend: {
            display: true,
          },
        }
      }
    });
  }

  getValorReal(datasetLabel: string, registro: any): string {
    switch (datasetLabel) {
      case 'Temperatura': return registro.temperatura || 'templado';
      case 'Humedad Ambiente': return registro.humedadAmbiente || 'media';
      case 'Clima': return registro.clima || 'nublado';
      case 'Humedad Suelo': return registro.humedadSuelo || 'normal';
      case 'Fenología': return registro.fenologia || 'creciendo';
      default: return 'No especificado';
    }
  }

  getTemperaturaValue(temp: string): number {
    switch (temp) {
      case 'frio': return 1;
      case 'templado': return 2;
      case 'caliente': return 3;
      default: return 2;
    }
  }

  getHumedadValue(humedad: string): number {
    switch (humedad) {
      case 'bajita': return 1;
      case 'media': return 2;
      case 'alta': return 3;
      default: return 2;
    }
  }

  getLabelForValue(datasetLabel: string, registro: any): string {
    if (datasetLabel === 'Temperatura') {
      return registro.temperatura || 'No especificado';
    } else if (datasetLabel === 'Humedad Ambiente') {
      return registro.humedadAmbiente || 'No especificado';
    }
    return 'No especificado';
  }

  // Navegación
  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Abrir vista de nuevo registro
  nuevoRegistro() {
    this.vistaActual = 'nuevo';
    this.form = {
      temperatura: '',
      humedadAmbiente: '',
      viento: '',
      clima: '',
      humedadSuelo: '',
      texturaSuelo: '',
      observacionesSuelo: '',
      fenologia: '',
      fecha: ''
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
    if (!this.form.clima || !this.form.fenologia) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const nuevo = {
      ...this.form,
      fecha: this.form.fecha || new Date().toISOString().split('T')[0]
    };

    this.historial.unshift(nuevo);
    this.ultimo = nuevo;

    // Actualizar el gráfico con los nuevos datos
    setTimeout(() => {
      this.renderAmbientalChart();
    }, 100);

    alert('Condiciones ambientales registradas correctamente.');
    this.vistaActual = 'info';
  }

  cancelar() {
    this.vistaActual = 'info';
  }

}
