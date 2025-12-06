import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { StorageService } from '../services/storage';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule]
})
export class GraficosPage implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    // Inicialización básica
  }

  ngAfterViewInit() {
    this.checkAndLoadSeguimientoData();
  }

  checkAndLoadSeguimientoData() {
    // Obtener registros de seguimiento desde Local Storage
    const seguimientos = this.storageService.getSeguimientoRecords();

    if (seguimientos && seguimientos.length > 0) {
      this.renderChart(seguimientos);
    } else {
      // Si no hay datos, mostrar gráfico vacío
      this.renderEmptyChart();
    }
  }

  renderEmptyChart() {
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
        labels: ['Sin datos'],
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

  getSeguimientoData() {
    // Obtener datos reales del Local Storage
    return this.storageService.getSeguimientoRecords();
  }

  renderChart(seguimientos: any[]) {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Ordenar seguimientos por fecha (más reciente primero) y tomar los últimos 10
    const seguimientosOrdenados = seguimientos
      .filter(s => s.fechaIntervencion)
      .sort((a, b) => new Date(b.fechaIntervencion).getTime() - new Date(a.fechaIntervencion).getTime())
      .slice(0, 10);

    if (seguimientosOrdenados.length === 0) {
      this.renderEmptyChart();
      return;
    }

    // Crear gráfico de líneas que muestra la secuencia temporal de acciones
    const labels = seguimientosOrdenados.map((s, index) => {
      const fecha = new Date(s.fechaIntervencion);
      return fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    });

    // Crear dataset único que muestra las acciones realizadas en orden cronológico
    const accionesData = seguimientosOrdenados.map((s, index) => ({
      x: index,
      y: 1,
      accion: s.accion || 'Sin acción',
      responsable: s.responsable || 'No asignado',
      fecha: s.fechaIntervencion,
      resultados: s.resultados || 'Sin resultados',
      estado: s.estado || 'Pendiente'
    }));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Acciones de Seguimiento',
          data: accionesData,
          borderColor: 'rgba(34, 139, 34, 1)',
          backgroundColor: 'rgba(34, 139, 34, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: (context) => {
            const index = context.dataIndex;
            const seguimiento = seguimientosOrdenados[index];
            return this.getStatusColor(seguimiento.estado || 'Pendiente').replace('0.8', '1');
          },
          pointBorderColor: 'rgba(255, 255, 255, 1)',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha de Intervención'
            },
            ticks: {
              maxTicksLimit: 10
            }
          },
          y: {
            display: false, // Ocultar eje Y ya que siempre es 1
            min: 0,
            max: 1.5
          }
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                const seguimiento = seguimientosOrdenados[index];
                return `Fecha: ${seguimiento.fechaIntervencion}`;
              },
              label: (context) => {
                const index = context.dataIndex;
                const seguimiento = seguimientosOrdenados[index];
                return [
                  `Acción: ${seguimiento.accion || 'Sin acción'}`,
                  `Responsable: ${seguimiento.responsable || 'No asignado'}`,
                  `Estado: ${seguimiento.estado || 'Pendiente'}`,
                  `Resultados: ${seguimiento.resultados || 'Sin resultados'}`
                ];
              }
            }
          }
        }
      }
    });
  }

  normalizeEstado(estado: string): 'completado' | 'progreso' | 'pendiente' {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('completad') || estadoLower.includes('terminad')) {
      return 'completado';
    } else if (estadoLower.includes('progreso') || estadoLower.includes('proceso')) {
      return 'progreso';
    } else {
      return 'pendiente';
    }
  }

  getStatusColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'completado':
      case 'completada':
        return 'rgba(34, 139, 34, 0.8)'; // Verde
      case 'en progreso':
      case 'en proceso':
        return 'rgba(255, 165, 0, 0.8)'; // Naranja
      case 'pendiente':
      default:
        return 'rgba(255, 0, 0, 0.8)'; // Rojo
    }
  }

  loadPreviousData() {
    // Simular carga de datos históricos
    const historicalData = [
      { fecha: '2023-12-01', descripcion: 'Preparación del suelo', estado: 'Completado' },
      { fecha: '2023-12-15', descripcion: 'Siembra', estado: 'Completado' },
      ...this.getSeguimientoData()
    ];
    this.renderChart(historicalData);
  }

  refreshData() {
    this.checkAndLoadSeguimientoData();
  }
}
