import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Usuario {
  id_usuario: number;
  username: string;
  rol: string;
  fecha_creacion: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  private apiUrl = environment.apiBaseUrl + '/api/auth';
  usuarios: Usuario[] = [];
  modalVisible = false;
  mensaje = '';
  mensajeTipo = '';

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<Usuario[]>(this.apiUrl).subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.mostrarMensaje('Error al cargar usuarios', 'error')
    });
  }

  abrirModal() {
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  guardarUsuario(datos: {username: string, password: string, rol: string}) {
    this.http.post(`${this.apiUrl}/register`, datos).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
        this.mostrarMensaje('Usuario creado exitosamente', 'exito');
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.error || 'Error al crear usuario', 'error');
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.mostrarMensaje('Usuario eliminado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al eliminar usuario', 'error');
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
