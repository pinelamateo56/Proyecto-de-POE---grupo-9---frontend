import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { FacturasService, EstadisticasVentas } from '../../services/facturas.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  estadisticasInventario: any = null;
  estadisticasVentas: EstadisticasVentas | null = null;
  cargando = true;

  constructor(
    private productosService: ProductosService,
    private facturasService: FacturasService
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando = true;
    this.productosService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticasInventario = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });

    this.facturasService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticasVentas = data;
      }
    });
  }
}
