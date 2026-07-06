import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-usuario-modal',
  templateUrl: './usuario-modal.component.html',
  styleUrls: ['./usuario-modal.component.css']
})
export class UsuarioModalComponent {
  @Input() visible = false;
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onGuardar = new EventEmitter<{username: string, password: string, rol: string}>();

  username = '';
  password = '';
  rol = 'cajero';

  cerrar() {
    this.onCerrar.emit();
  }

  guardar() {
    if (this.username && this.password) {
      this.onGuardar.emit({
        username: this.username,
        password: this.password,
        rol: this.rol
      });
    }
  }
}
