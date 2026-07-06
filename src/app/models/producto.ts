export interface Producto {
  id_producto: number;
  codigo_barra: string;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
}
