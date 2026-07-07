import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private apiUrl = environment.apiBaseUrl + '/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  createProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  updateStock(id: number, stock_actual: number): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}/stock`, { stock_actual });
  }

  updateParametros(id: number, precio_venta: number, stock_minimo: number): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}/parametros`, { precio_venta, stock_minimo });
  }

  buscarPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/buscar/${codigo}`);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`);
  }
}
