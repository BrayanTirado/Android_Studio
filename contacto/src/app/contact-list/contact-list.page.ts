import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonButtons, IonFab, IonFabButton, IonSearchbar } from '@ionic/angular/standalone';
import { add, create, trash, eye, pencil } from 'ionicons/icons';
import { ContactService, Contact } from '../services/contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonButtons, IonFab, IonFabButton, IonSearchbar],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Telefono</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onAdd()">
            <ion-icon slot="icon-only" [icon]="create"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <ion-searchbar placeholder="Buscar por Nombre o Apellido" [(ngModel)]="query" (ionInput)="filter()"></ion-searchbar>

      <ion-list>
        <ion-item *ngFor="let c of visibleContacts">
          <img *ngIf="c.foto" [src]="c.foto" style="width:48px;height:48px;border-radius:8px;object-fit:cover;margin-right:12px;" />
          <ion-label>
            <h2>{{c.nombre}} {{c.apellido}}</h2>
            <p>{{c.empresa}} · {{c.telefono}}</p>
            <p class="muted">{{c.correo}}</p>
          </ion-label>
          <ion-buttons slot="end">
            <ion-button fill="clear" (click)="onView(c.id)">
              <ion-icon slot="icon-only" [icon]="eye"></ion-icon>
            </ion-button>
            <ion-button fill="clear" (click)="onEdit(c.id)">
              <ion-icon slot="icon-only" [icon]="pencil"></ion-icon>
            </ion-button>
            <ion-button color="danger" (click)="onDelete(c.id)">
              <ion-icon slot="icon-only" [icon]="trash"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>

      <div *ngIf="(contacts?.length ?? 0) === 0" class="empty">
        No hay contactos. Presiona + para crear uno.
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="onAdd()">
          <ion-icon [icon]="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .muted {
      color: var(--ion-color-medium);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .empty {
      text-align: center;
      margin-top: 3rem;
      color: var(--ion-color-medium);
      font-size: 1.1rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.8);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius-large);
      box-shadow: var(--shadow-light);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    ion-item {
      --background: rgba(255, 255, 255, 0.95);
      --border-radius: var(--border-radius-large);
      --padding-start: var(--spacing-lg);
      --padding-end: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
      box-shadow: var(--shadow-medium);
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    ion-item:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-heavy);
      --background: rgba(255, 255, 255, 1);
    }

    ion-item img {
      border-radius: var(--border-radius-medium);
      box-shadow: var(--shadow-light);
      transition: transform 0.3s ease;
    }

    ion-item:hover img {
      transform: scale(1.1);
    }

    ion-item h2 {
      color: var(--ion-color-dark);
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
      font-size: 1.1rem;
    }

    ion-item p {
      color: var(--ion-color-medium);
      font-size: 0.95rem;
      margin: 0;
    }

    ion-item .muted {
      color: var(--ion-color-tertiary);
      font-weight: 600;
    }

    ion-searchbar {
      --background: rgba(255, 255, 255, 0.9);
      --border-radius: var(--border-radius-xl);
      --box-shadow: var(--shadow-medium);
      --placeholder-color: var(--ion-color-medium);
      margin-bottom: var(--spacing-lg);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
    }

    ion-fab-button {
      --background: var(--gradient-primary);
      --color: white;
      --box-shadow: var(--shadow-heavy);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    ion-toolbar {
      --background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: var(--shadow-light);
    }

    ion-title {
      color: var(--ion-color-dark);
      font-weight: 700;
      font-size: 1.2rem;
    }
  `]
})
export class ContactListPage implements OnInit {
  contacts: Contact[] = [];
  visibleContacts: Contact[] = [];
  contacts$ = this.contactService.getAll();
  query = '';
  create = create;
  add = add;
  trash = trash;
  eye = eye;
  pencil = pencil;

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit() {
    this.contactService.seedExampleIfEmpty();
    this.contacts$.subscribe(list => {
      this.contacts = list;
      this.filter();
    });
  }

  filter() {
    const q = this.query?.toLowerCase?.() ?? '';
    if (!q) {
      this.visibleContacts = this.contacts.slice();
      return;
    }
    this.visibleContacts = this.contacts.filter(c =>
      (c.nombre + ' ' + c.apellido + ' ' + (c.empresa ?? '') + ' ' + (c.telefono ?? '') + ' ' + (c.correo ?? '')).toLowerCase().includes(q)
    );
  }

  onAdd() {
    this.router.navigate(['/contactos/new']);
  }

  onView(id: string) {
    this.router.navigate(['/contactos', id]);
  }

  onEdit(id: string) {
    this.router.navigate(['/contactos', id, 'edit']);
  }

  onDelete(id: string) {
    const c = this.contactService.getById(id);
    if (!c) return;
    const conf = confirm(`Eliminar contacto: ${c.nombre} ${c.apellido}?`);
    if (!conf) return;
    this.contactService.delete(id);
  }
}