export interface Cliente {
  id_cliente: number;
  cedula: string;
  nombre: string;
  telefono?: string;
  correo?: string;
  fecha_registro: string;
}
