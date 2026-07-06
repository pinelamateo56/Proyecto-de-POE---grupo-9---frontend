import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaRequest, FacturaResponse } from '../models/factura';

export interface Factura {
  id_factura: number;
  numero_factura: string;
  fecha_emision: string;
  cliente_identificacion: string;
  cliente_nombre?: string;
  total_pagar: number;
  metodo_pago: string;
}

export interface DetalleFacturaCompleto {
  id_detalle: number;
  id_producto: number;
  nombre_producto: string;
  codigo_barra: string;
  cantidad: number;
  precio_unitario_historico: number;
  subtotal_item: number;
}

export interface FacturaConDetalles {
  factura: Factura;
  detalles: DetalleFacturaCompleto[];
}

export interface EstadisticasVentas {
  ventas_hoy: { total: number; monto: number };
  ventas_mes: { total: number; monto: number };
  total_ventas: { total: number; monto: number };
  productos_mas_vendidos: { nombre: string; total_vendido: number }[];
}

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private apiUrl = 'api/facturas';

  constructor(private http: HttpClient) {}

  crearFactura(factura: FacturaRequest): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(this.apiUrl, factura);
  }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  getFacturaById(id: number): Observable<FacturaConDetalles> {
    return this.http.get<FacturaConDetalles>(`${this.apiUrl}/${id}`);
  }

  getEstadisticas(): Observable<EstadisticasVentas> {
    return this.http.get<EstadisticasVentas>(`${this.apiUrl}/estadisticas`);
  }
}
