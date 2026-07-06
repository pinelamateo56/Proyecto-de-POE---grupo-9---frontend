import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  mensaje = '';
  mensajeTipo = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.redirigirPorRol();
    }
  }

  login(): void {
    if (!this.username || !this.password) {
      this.mensaje = 'Ingrese usuario y contraseña';
      this.mensajeTipo = 'error';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.redirigirPorRol();
      },
      error: (err) => {
        this.cargando = false;
        this.mensaje = err.error?.error || 'Error al iniciar sesión';
        this.mensajeTipo = 'error';
      }
    });
  }

  private redirigirPorRol(): void {
    const rol = this.authService.getRol();
    if (rol === 'cajero') {
      this.router.navigate(['/facturacion']);
    } else {
      this.router.navigate(['/inventario']);
    }
  }
}
