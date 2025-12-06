import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonList,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonIcon, IonImg, IonThumbnail
} from '@ionic/angular/standalone';

interface Evidencia {
  id: number;
  imagen: string; // base64
  descripcion: string;
  fecha: string;
}

@Component({
  selector: 'app-evidencia',
  templateUrl: './evidencia.page.html',
  styleUrls: ['./evidencia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonList,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonIcon, IonImg, IonThumbnail
  ]
})
export class EvidenciaPage implements OnInit, AfterViewInit {
  @ViewChild('evidenciaChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  vistaActual: 'info' | 'historial' | 'nuevo' | 'detalle' = 'info';
  ultimo: Evidencia | null = null;
  cameraActive = false;
  private stream: MediaStream | null = null;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  historial: Evidencia[] = [
    {
      id: 1,
      imagen: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      descripcion: 'Evidencia inicial',
      fecha: '2025-11-26'
    }
  ];

  registroDetalle: Evidencia | null = null;

  form = {
    imagen: '',
    descripcion: ''
  };

  currentDate: string = new Date().toLocaleDateString();

  constructor(private router: Router) {}

  ngOnInit() {
    this.ultimo = this.historial.length > 0 ? this.historial[0] : null;
  }

  ngAfterViewInit() {
    this.renderEvidenciaChart();
  }

  renderEvidenciaChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Ordenar evidencias por fecha y tomar las últimas 10
    const evidenciasOrdenadas = this.historial
      .filter((e: any) => e.fecha)
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 10);

    if (evidenciasOrdenadas.length === 0) {
      this.renderEmptyEvidenciaChart();
      return;
    }

    // Crear gráfico de barras que muestra evidencias por fecha
    const labels = evidenciasOrdenadas.map((e: any, index: number) => {
      const fecha = new Date(e.fecha);
      return fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    });

    // Contar evidencias por fecha (si hay múltiples en el mismo día)
    const fechaCount: { [key: string]: number } = {};
    evidenciasOrdenadas.forEach((e: any) => {
      const fechaLabel = new Date(e.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      fechaCount[fechaLabel] = (fechaCount[fechaLabel] || 0) + 1;
    });

    const data = labels.map(label => fechaCount[label] || 0);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evidencias Registradas',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }]
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
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Cantidad de Evidencias'
            }
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
                const evidencia = evidenciasOrdenadas[index];
                return `Fecha: ${evidencia.fecha}`;
              },
              label: (context) => {
                const index = context.dataIndex;
                const evidencia = evidenciasOrdenadas[index];
                const descripcion = evidencia.descripcion || 'Sin descripción';
                const cantidad = context.parsed.y || 0;

                // Mostrar descripción truncada si es muy larga
                const descTruncada = descripcion.length > 50 ?
                  descripcion.substring(0, 50) + '...' : descripcion;

                return [
                  `Evidencias: ${cantidad}`,
                  `Descripción: ${descTruncada}`
                ];
              }
            }
          }
        }
      }
    });
  }

  renderEmptyEvidenciaChart() {
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
        labels: ['Sin evidencias'],
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

  volverDashboard() {
    this.router.navigate(['/dashboard']);
  }

  nuevoRegistro() {
    this.vistaActual = 'nuevo';
    this.form = { imagen: '', descripcion: '' };
  }

  verHistorial() {
    this.vistaActual = 'historial';
  }

  volverInfo() {
    this.vistaActual = 'info';
  }

  verDetalle(registro: Evidencia) {
    this.registroDetalle = registro;
    this.vistaActual = 'detalle';
  }

  async tomarFoto() {
    // En web intentamos abrir la cámara con getUserMedia para tomar foto
    try {
      const platform = Capacitor.getPlatform();
      if (platform === 'web') {
        // Preferimos getUserMedia para abrir la cámara en el navegador
        if (navigator.mediaDevices) {
          await this.startCamera();
          return;
        }

        // Si no hay soporte, usamos el fallback input file
        const dataUrl = await this.openFileCapture({ capture: 'environment' });
        if (dataUrl) this.form.imagen = dataUrl;
        return;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.form.imagen = image.dataUrl || '';
    } catch (error) {
      alert('Error al acceder a la cámara. ' + (error as any).message);
    }
  }

  async startCamera() {
    try {
      this.cameraActive = true;
      const constraints = { video: { facingMode: { ideal: 'environment' } }, audio: false } as MediaStreamConstraints;
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Esperar a que el elemento video exista en el DOM
      const waitForVideo = () => new Promise<void>((res) => {
        const check = () => {
          if (this.video && this.video.nativeElement) return res();
          setTimeout(check, 50);
        };
        check();
      });

      await waitForVideo();
      this.video.nativeElement.srcObject = this.stream;
      await this.video.nativeElement.play();
    } catch (e: any) {
      this.cameraActive = false;
      this.stopCamera();
      // Si hay error, intentamos fallback a input file
      const dataUrl = await this.openFileCapture({ capture: 'environment' });
      if (dataUrl) this.form.imagen = dataUrl;
    }
  }

  captureFromCamera() {
    try {
      const videoEl = this.video.nativeElement as HTMLVideoElement;
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth || videoEl.clientWidth || 640;
      canvas.height = videoEl.videoHeight || videoEl.clientHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      this.form.imagen = dataUrl;
    } catch (e) {
      alert('Error capturando la imagen: ' + (e as any).message);
    } finally {
      this.stopCamera();
      this.cameraActive = false;
    }
  }

  cancelarCamara() {
    this.stopCamera();
    this.cameraActive = false;
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  // Abre un input file programáticamente y devuelve un DataURL (string) de la imagen seleccionada
  private openFileCapture(opts?: { capture?: string }): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        if (opts?.capture) input.setAttribute('capture', opts.capture);

        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', () => {
          const file = input.files && input.files[0];
          if (!file) {
            document.body.removeChild(input);
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string | ArrayBuffer | null;
            document.body.removeChild(input);
            if (!result) return resolve(null);
            resolve(result as string);
          };
          reader.onerror = () => {
            document.body.removeChild(input);
            resolve(null);
          };
          reader.readAsDataURL(file);
        }, { once: true });

        // Al invocar click() se abrirá la cámara en móviles si el navegador lo soporta
        input.click();
      } catch (e) {
        resolve(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async importarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      this.form.imagen = image.dataUrl || '';
    } catch (error) {
      alert('Error al acceder a la galería. ' + (error as any).message);
    }
  }

  guardar() {
    if (!this.form.imagen || !this.form.descripcion.trim()) {
      alert('Por favor selecciona una imagen y agrega una descripción.');
      return;
    }

    const nuevo: Evidencia = {
      id: Date.now(),
      imagen: this.form.imagen,
      descripcion: this.form.descripcion,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.historial.unshift(nuevo);
    this.ultimo = nuevo;

    // Actualizar el gráfico con los nuevos datos
    setTimeout(() => {
      this.renderEvidenciaChart();
    }, 100);

    alert('Evidencia guardada correctamente.');
    this.vistaActual = 'info';
  }

  cancelar() {
    this.vistaActual = 'info';
  }
}
