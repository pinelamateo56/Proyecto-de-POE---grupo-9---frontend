import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturasService, FacturaConDetalles } from '../../services/facturas.service';

@Component({
  selector: 'app-factura-detalle',
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-detalle.component.css']
})
export class FacturaDetalleComponent implements OnInit {
  factura: FacturaConDetalles | null = null;
  private queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturasService: FacturasService
  ) {}

  ngOnInit() {
    this.queryParams = { ...this.route.snapshot.queryParams };

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facturasService.getFacturaById(+id).subscribe(data => {
        this.factura = data;
      });
    }
  }

  volver() {
    this.router.navigate(['/facturas'], { queryParams: this.queryParams });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CR');
  }
}
