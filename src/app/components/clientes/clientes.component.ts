import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { ClientesService } from '../../services/clientes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  buscarTexto = '';
  modalVisible = false;
  clienteSeleccionado: Cliente | null = null;
  mensaje = '';
  mensajeTipo = '';

  constructor(
    private clientesService: ClientesService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.aplicarFiltros();
      },
      error: (err) => {
        this.mostrarMensaje('Error al cargar clientes', 'error');
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.clientes];

    if (this.buscarTexto) {
      const texto = this.buscarTexto.toLowerCase();
      resultado = resultado.filter(c =>
        c.cedula.toLowerCase().includes(texto) ||
        c.nombre.toLowerCase().includes(texto)
      );
    }

    this.clientesFiltrados = resultado;
  }

  abrirModalNuevo() {
    this.clienteSeleccionado = null;
    this.modalVisible = true;
  }

  abrirModalEditar(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.clienteSeleccionado = null;
  }

  guardarCliente(cliente: Partial<Cliente>) {
    if (this.clienteSeleccionado) {
      this.clientesService.updateCliente(this.clienteSeleccionado.id_cliente, cliente).subscribe({
        next: () => {
          this.cargarClientes();
          this.mostrarMensaje('Cliente actualizado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al actualizar cliente', 'error');
        }
      });
    } else {
      this.clientesService.createCliente(cliente).subscribe({
        next: () => {
          this.cargarClientes();
          this.mostrarMensaje('Cliente creado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al crear cliente', 'error');
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de desactivar este cliente?')) {
      this.clientesService.deleteCliente(id).subscribe({
        next: () => {
          this.cargarClientes();
          this.mostrarMensaje('Cliente desactivado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al desactivar cliente', 'error');
        }
      });
    }
  }

  mostrarMensaje(texto: string, tipo: string) {
    this.mensaje = texto;
    this.mensajeTipo = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.mensajeTipo = '';
    }, 5000);
  }
}
