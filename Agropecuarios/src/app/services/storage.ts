import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Guardar datos en Local Storage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener datos del Local Storage
  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Eliminar un item del Local Storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpiar todo el Local Storage
  clear(): void {
    localStorage.clear();
  }

  // Métodos específicos para registros de seguimiento
  getSeguimientoRecords(): any[] {
    return this.getItem('seguimiento_records') || [];
  }

  saveSeguimientoRecords(records: any[]): void {
    this.setItem('seguimiento_records', records);
  }

  addSeguimientoRecord(record: any): void {
    const records = this.getSeguimientoRecords();
    records.unshift(record); // Agregar al inicio
    this.saveSeguimientoRecords(records);
  }

  updateSeguimientoRecords(records: any[]): void {
    this.saveSeguimientoRecords(records);
  }

  // Verificar si hay registros de seguimiento
  hasSeguimientoRecords(): boolean {
    const records = this.getSeguimientoRecords();
    return records && records.length > 0;
  }
}
