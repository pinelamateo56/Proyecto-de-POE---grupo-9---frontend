import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.component.html',
  styleUrls: ['./producto-modal.component.css']
})
export class ProductoModalComponent implements OnInit {
  @Input() producto: Producto | null = null;
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Partial<Producto>>();

  formulario!: FormGroup;
  esEdicion = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      codigo_barra: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      precio_venta: ['', [Validators.required, Validators.min(0.01)]],
      stock_actual: ['', [Validators.required, Validators.min(0)]],
      stock_minimo: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnChanges() {
    if (this.producto) {
      this.esEdicion = true;
      this.formulario.patchValue(this.producto);
    } else {
      this.esEdicion = false;
      this.formulario.reset();
    }
  }

  cerrar() {
    this.visible = false;
    this.closed.emit();
  }

  guardar() {
    if (this.formulario.valid) {
      this.saved.emit(this.formulario.value);
      this.cerrar();
    }
  }

  bloquearNegativos(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }
}
