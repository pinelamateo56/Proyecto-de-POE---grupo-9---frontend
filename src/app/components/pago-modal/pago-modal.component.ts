import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PagoConfirmado {
  metodo: 'efectivo' | 'transferencia';
  monto_recibido?: number;
  cambio?: number;
}

@Component({
  selector: 'app-pago-modal',
  templateUrl: './pago-modal.component.html',
  styleUrls: ['./pago-modal.component.css']
})
export class PagoModalComponent {
  @Input() visible = false;
  @Input() total: number = 0;
  @Output() onConfirmar = new EventEmitter<PagoConfirmado>();
  @Output() onCancelar = new EventEmitter<void>();

  metodoSeleccionado: 'efectivo' | 'transferencia' | null = null;
  montoRecibido: number = 0;
  cambio: number = 0;

  seleccionarMetodo(metodo: 'efectivo' | 'transferencia') {
    this.metodoSeleccionado = metodo;
    if (metodo === 'efectivo') {
      this.montoRecibido = 0;
      this.cambio = 0;
    }
  }

  calcularCambio() {
    if (this.montoRecibido >= this.total) {
      this.cambio = this.montoRecibido - this.total;
    } else {
      this.cambio = 0;
    }
  }

  bloquearNegativos(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  confirmarEfectivo() {
    if (this.montoRecibido >= this.total) {
      this.onConfirmar.emit({
        metodo: 'efectivo',
        monto_recibido: this.montoRecibido,
        cambio: this.cambio
      });
    }
  }

  confirmarTransferencia() {
    this.onConfirmar.emit({
      metodo: 'transferencia'
    });
  }

  cancelar() {
    this.metodoSeleccionado = null;
    this.montoRecibido = 0;
    this.cambio = 0;
    this.onCancelar.emit();
  }

  cerrar() {
    this.metodoSeleccionado = null;
    this.montoRecibido = 0;
    this.cambio = 0;
  }
}
