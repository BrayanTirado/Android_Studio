import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'riesgos',
    loadComponent: () => import('./riesgos/riesgos.page').then( m => m.RiesgosPage)
  },
  {
    path: 'riesgos-info',
    loadComponent: () => import('./riesgos-info/riesgos-info.page').then( m => m.RiesgosInfoPage)
  },
  {
    path: 'condiciones-ambientales',
    loadComponent: () => import('./condiciones-ambientales/condiciones-ambientales.page').then( m => m.CondicionesAmbientalesPage)
  },
  {
    path: 'seguimiento',
    loadComponent: () => import('./seguimiento/seguimiento.page').then( m => m.SeguimientoPage)
  },
  {
    path: 'evidencia',
    loadComponent: () => import('./evidencia/evidencia.page').then( m => m.EvidenciaPage)
  },
  {
    path: 'graficos',
    loadComponent: () => import('./graficos/graficos.page').then( m => m.GraficosPage)
  }
];
