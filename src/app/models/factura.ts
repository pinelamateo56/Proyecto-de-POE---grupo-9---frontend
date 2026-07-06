export interface DetalleFactura {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  nombre?: string;
}

export interface FacturaRequest {
  numero_factura?: string;
  id_cliente?: number;
  cliente_identificacion: string;
  metodo_pago: 'efectivo' | 'transferencia';
  monto_recibido?: number | null;
  cambio?: number | null;
  detalles: DetalleFactura[];
}

export interface FacturaResponse {
  factura: {
    id_factura: number;
    numero_factura: string;
    fecha_emision: string;
    cliente_identificacion: string;
    total_pagar: number;
  };
  alerta_reorden: boolean;
  productos_reabastecer: { nombre: string; stock_actual: number; stock_minimo: number }[];
}
