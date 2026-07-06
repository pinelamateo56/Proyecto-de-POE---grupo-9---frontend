import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ProductoModalComponent } from './components/inventario/producto-modal/producto-modal.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { LoginComponent } from './components/login/login.component';
import { FacturaHistorialComponent } from './components/factura-historial/factura-historial.component';
import { FacturaDetalleComponent } from './components/factura-detalle/factura-detalle.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteModalComponent } from './components/clientes/cliente-modal/cliente-modal.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioModalComponent } from './components/usuarios/usuario-modal/usuario-modal.component';
import { PagoModalComponent } from './components/pago-modal/pago-modal.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    InventarioComponent,
    ProductoModalComponent,
    FacturacionComponent,
    LoginComponent,
    FacturaHistorialComponent,
    FacturaDetalleComponent,
    ClientesComponent,
    ClienteModalComponent,
    ReportesComponent,
    UsuariosComponent,
    UsuarioModalComponent,
    PagoModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
