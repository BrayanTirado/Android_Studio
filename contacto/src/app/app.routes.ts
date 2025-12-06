import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'contactos',
    loadComponent: () => import('./contact-list/contact-list.page').then((m) => m.ContactListPage),
  },
  {
    path: 'contactos/new',
    loadComponent: () => import('./contact-form/contact-form.page').then((m) => m.ContactFormPage),
  },
  {
    path: 'contactos/:id',
    loadComponent: () => import('./contact-detail/contact-detail.page').then((m) => m.ContactDetailPage),
  },
  {
    path: 'contactos/:id/edit',
    loadComponent: () => import('./contact-form/contact-form.page').then((m) => m.ContactFormPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'contactos',
    pathMatch: 'full',
  },
];
