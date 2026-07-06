import { Injectable } from '@angular/core';
import { DetalleFactura } from '../models/factura';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'dutc_cart';
  private clientKey = 'dutc_cliente';

  constructor() {}

  getCart(): (DetalleFactura & { nombre?: string })[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  saveCart(detalles: (DetalleFactura & { nombre?: string })[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(detalles));
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }

  getCliente(): { id_cliente: number; cedula: string; nombre: string } | null {
    const data = localStorage.getItem(this.clientKey);
    return data ? JSON.parse(data) : null;
  }

  saveCliente(cliente: { id_cliente: number; cedula: string; nombre: string }): void {
    localStorage.setItem(this.clientKey, JSON.stringify(cliente));
  }

  clearCliente(): void {
    localStorage.removeItem(this.clientKey);
  }
}
