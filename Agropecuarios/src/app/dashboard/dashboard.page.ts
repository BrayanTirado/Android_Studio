import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class DashboardPage implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  irAlModulo(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value.toLowerCase().trim();
    if (this.searchQuery.length > 0) {
      this.performSearch(this.searchQuery);
    } else {
      this.searchResults = [];
    }
  }

  onSearchSubmit() {
    if (this.searchQuery && this.searchResults.length > 0) {
      // Si hay resultados, navegar al primero
      this.navigateToResult(this.searchResults[0]);
    }
  }

  performSearch(query: string) {
    // Definir módulos disponibles con sus descripciones
    const modules = [
      {
        id: 'riesgos-info',
        title: 'Riesgos',
        description: 'Gestión de riesgos agrícolas, plagas y enfermedades',
        keywords: ['riesgos', 'riesgo', 'riesgos-info', 'plagas', 'enfermedades', 'daños', 'problemas', 'evaluación', 'evaluacion']
      },
      {
        id: 'condiciones-ambientales',
        title: 'Condiciones Ambientales',
        description: 'Clima, temperatura, humedad y estado del suelo',
        keywords: ['ambientales', 'ambiente', 'condiciones-ambientales', 'clima', 'temperatura', 'humedad', 'suelo', 'fenológico', 'fenologico', 'meteorológico', 'meteorologico']
      },
      {
        id: 'seguimiento',
        title: 'Seguimiento',
        description: 'Registro de acciones, intervenciones y progreso',
        keywords: ['seguimiento', 'seguir', 'seguimiento', 'acciones', 'tareas', 'intervenciones', 'responsables', 'progreso', 'actividades']
      },
      {
        id: 'evidencia',
        title: 'Evidencia',
        description: 'Fotografías y registros visuales del cultivo',
        keywords: ['evidencia', 'evidencia', 'fotos', 'fotografías', 'fotografias', 'imágenes', 'imagenes', 'registros', 'visuales']
      },
      {
        id: 'graficos',
        title: 'Gráficos',
        description: 'Visualización de datos y estadísticas agrícolas',
        keywords: ['gráficos', 'graficos', 'graficos', 'estadísticas', 'estadisticas', 'datos', 'visualización', 'visualizacion', 'análisis', 'analisis', 'charts', 'chart']
      }
    ];

    // Buscar módulos que coincidan con la consulta
    const results = modules.filter(module =>
      module.keywords.some(keyword =>
        keyword.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(keyword.toLowerCase())
      ) ||
      module.title.toLowerCase().includes(query.toLowerCase()) ||
      module.description.toLowerCase().includes(query.toLowerCase()) ||
      module.id.toLowerCase().includes(query.toLowerCase())
    );

    this.searchResults = results;
  }

  navigateToResult(result: any) {
    this.router.navigate(['/' + result.id]);
    this.searchQuery = '';
    this.searchResults = [];
  }
}
