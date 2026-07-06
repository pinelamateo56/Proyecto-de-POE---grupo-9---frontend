import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturasService, Factura } from '../../services/facturas.service';

@Component({
  selector: 'app-factura-historial',
  templateUrl: './factura-historial.component.html',
  styleUrls: ['./factura-historial.component.css']
})
export class FacturaHistorialComponent implements OnInit {
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];

  filtroCliente: string = '';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';

  constructor(
    private facturasService: FacturasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const qp = this.route.snapshot.queryParams;
    this.filtroCliente = qp['cliente'] || '';
    this.filtroFechaDesde = qp['fechaDesde'] || '';
    this.filtroFechaHasta = qp['fechaHasta'] || '';

    this.cargarFacturas();
  }

  cargarFacturas() {
    this.facturasService.getFacturas().subscribe(data => {
      this.facturas = data;
      this.aplicarFiltros();
    });
  }

aplicarFiltros() {
  let resultado = [...this.facturas];

  // Filtro por texto (cliente)
  if (this.filtroCliente.trim()) {
    const texto = this.filtroCliente.toLowerCase();
    resultado = resultado.filter(f =>
      (f.cliente_identificacion && f.cliente_identificacion.toLowerCase().includes(texto)) ||
      ((f as any).cliente_nombre && (f as any).cliente_nombre.toLowerCase().includes(texto))
    );
  }

  // Filtro por fecha desde
  if (this.filtroFechaDesde) {
    const desde = this.parsearFechaLocal(this.filtroFechaDesde);
    resultado = resultado.filter(f =>
      this.soloFecha(f.fecha_emision).getTime() >= desde.getTime()
    );
  }

  // Filtro por fecha hasta
  if (this.filtroFechaHasta) {
    const hasta = this.parsearFechaLocal(this.filtroFechaHasta);
    resultado = resultado.filter(f =>
      this.soloFecha(f.fecha_emision).getTime() <= hasta.getTime()
    );
  }

  this.facturasFiltradas = resultado;
}

/**
 * Convierte un string "YYYY-MM-DD" (proveniente de un <input type="date">)
 * en un Date construido en hora LOCAL, evitando el corrimiento de un día
 * que ocurre si se usa new Date("YYYY-MM-DD") directamente (se interpreta como UTC).
 */
private parsearFechaLocal(fechaStr: string): Date {
  const [y, m, d] = fechaStr.split('-').map(Number);
  return new Date(y, m - 1, d); // hora local, 00:00:00
}

/**
 * Normaliza cualquier fecha (Date o string, con o sin hora) a
 * medianoche LOCAL, para poder comparar solo por día calendario.
 */
private soloFecha(fecha: Date | string): Date {
  const d = new Date(fecha);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

  getFiltrosQueryParams(): any {
    const params: any = {};
    if (this.filtroCliente) params.cliente = this.filtroCliente;
    if (this.filtroFechaDesde) params.fechaDesde = this.filtroFechaDesde;
    if (this.filtroFechaHasta) params.fechaHasta = this.filtroFechaHasta;
    return params;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CR');
  }
}
