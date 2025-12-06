import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { arrowBack, pencil, trash } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService, Contact } from '../services/contact.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" (click)="onBack()">
            <ion-icon [icon]="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Detalle</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="onEdit()" *ngIf="contact">
            <ion-icon [icon]="pencil"></ion-icon>
          </ion-button>
          <ion-button color="danger" fill="clear" (click)="onDelete()" *ngIf="contact">
            <ion-icon [icon]="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div *ngIf="contact; else empty" class="detail-wrapper">
        <div class="avatar-wrap">
          <img *ngIf="contact.foto" [src]="contact.foto" class="avatar" />
        </div>

        <div class="info">
          <h2 class="name">{{contact.nombre}} {{contact.apellido}}</h2>

          <div class="details">
            <div><strong>Empresa:</strong> {{contact.empresa || '-'}}</div>
            <div><strong>Teléfono:</strong> {{contact.telefono || '-'}}</div>
            <div><strong>Correo:</strong> {{contact.correo || '-'}}</div>
            <div><strong>Dirección:</strong> {{contact.direccion || '-'}}</div>
            <div><strong>Nota:</strong> {{contact.nota || '-'}}</div>
          </div>
        </div>
      </div>
      <ng-template #empty>
        <div class="empty">Contacto no encontrado.</div>
      </ng-template>
    </ion-content>
  `,
  styles: [`
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

    .detail-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-xl);
      background: rgba(255, 255, 255, 0.9);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-heavy);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      animation: slideUp 0.5s ease-out;
      max-width: 500px;
      margin: 0 auto;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .avatar-wrap {
      margin-bottom: var(--spacing-lg);
      position: relative;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: var(--shadow-heavy);
      border: 4px solid var(--gradient-primary);
      transition: transform 0.3s ease;
    }

    .avatar:hover {
      transform: scale(1.05);
    }

    .info {
      text-align: center;
      width: 100%;
    }

    .name {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--ion-color-dark);
      margin-bottom: var(--spacing-lg);
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .details {
      background: rgba(255, 255, 255, 0.8);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-large);
      box-shadow: var(--shadow-light);
      width: 100%;
    }

    .details div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 1rem;
    }

    .details div:last-child {
      border-bottom: none;
    }

    .details strong {
      color: var(--ion-color-dark);
      font-weight: 700;
      min-width: 100px;
    }

    .details div:last-child {
      color: var(--ion-color-medium);
      font-style: italic;
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

    ion-button {
      --border-radius: var(--border-radius-medium);
      --box-shadow: var(--shadow-light);
      font-weight: 600;
      transition: all 0.3s ease;
    }

    ion-button:hover {
      transform: scale(1.05);
    }
  `]
})
export class ContactDetailPage implements OnInit {
  contact: Contact | undefined;
  arrowBack = arrowBack;
  pencil = pencil;
  trash = trash;
  contactId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private contactService: ContactService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.contactId = id;
      if (!id) {
        this.router.navigate(['/contactos']);
        return;
      }
      this.contact = this.contactService.getById(id);
      if (!this.contact) {
        // Si no lo encuentra, vuelve a la lista
        setTimeout(() => this.router.navigate(['/contactos']), 700);
      }
    });
  }

  onBack() {
    this.router.navigate(['/contactos']);
  }

  onEdit() {
    if (!this.contactId) return;
    this.router.navigate(['/contactos', this.contactId, 'edit']);
  }

  onDelete() {
    if (!this.contactId) return;
    const c = this.contactService.getById(this.contactId);
    if (!c) return;
    const conf = confirm(`Eliminar contacto: ${c.nombre} ${c.apellido}?`);
    if (!conf) return;
    this.contactService.delete(this.contactId);
    this.router.navigate(['/contactos']);
  }
}