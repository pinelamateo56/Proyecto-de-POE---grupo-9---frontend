import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent implements OnInit {
  @Input() cliente: Cliente | null = null;
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Partial<Cliente>>();

  formulario!: FormGroup;
  esEdicion = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(15)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      correo: ['', [Validators.email]]
    });
  }

  ngOnChanges() {
    if (this.cliente) {
      this.esEdicion = true;
      this.formulario.patchValue(this.cliente);
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
}
