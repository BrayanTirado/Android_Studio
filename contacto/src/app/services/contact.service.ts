import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Contact {
  id: string;
  nombre: string;
  apellido: string;
  empresa?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  nota?: string;
  foto?: string; // base64 data URL or remote URL
  createdAt?: number;
  updatedAt?: number;
}

const STORAGE_KEY = 'contactos_v1';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts$ = new BehaviorSubject<Contact[]>(this.loadFromStorage());

  constructor() {}

  private loadFromStorage(): Contact[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Contact[];
    } catch (e) {
      console.error('Error cargando contactos desde localStorage', e);
      return [];
    }
  }

  private saveToStorage(contacts: Contact[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      this.contacts$.next(contacts);
    } catch (e) {
      console.error('Error guardando contactos en localStorage', e);
    }
  }

  getAll(): Observable<Contact[]> {
    return this.contacts$.asObservable();
  }

  getById(id: string): Contact | undefined {
    return this.contacts$.getValue().find(c => c.id === id);
  }

  create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const contacts = this.contacts$.getValue().slice();
    const newContact: Contact = {
      ...contact,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as Contact;
    contacts.unshift(newContact);
    this.saveToStorage(contacts);
    return newContact;
  }

  update(updated: Contact): Contact | undefined {
    const contacts = this.contacts$.getValue().slice();
    const idx = contacts.findIndex(c => c.id === updated.id);
    if (idx === -1) return undefined;
    updated.updatedAt = Date.now();
    contacts[idx] = { ...contacts[idx], ...updated };
    this.saveToStorage(contacts);
    return contacts[idx];
  }

  delete(id: string): boolean {
    const contacts = this.contacts$.getValue().slice();
    const idx = contacts.findIndex(c => c.id === id);
    if (idx === -1) return false;
    contacts.splice(idx, 1);
    this.saveToStorage(contacts);
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  seedExampleIfEmpty() {
    const contacts = this.contacts$.getValue();
    if (contacts.length === 0) {
      const sample: Contact[] = [
        {
          id: this.generateId(),
          nombre: 'Jose',
          apellido: 'Quiroga',
          empresa: 'ACME',
          telefono: '+57 321 555 1234',
          correo: 'jose.perez@example.com',
          direccion: 'Calle 15 #3-68',
          nota: 'Cliente importante',
          foto: '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      this.saveToStorage(sample);
    }
  }
}