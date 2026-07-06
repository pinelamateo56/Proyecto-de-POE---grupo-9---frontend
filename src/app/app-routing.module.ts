import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { FacturaHistorialComponent } from './components/factura-historial/factura-historial.component';
import { FacturaDetalleComponent } from './components/factura-detalle/factura-detalle.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'bodeguero'] }
  },
  {
    path: 'facturacion',
    component: FacturacionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'cajero'] }
  },
  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'facturas',
    component: FacturaHistorialComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'cajero'] }
  },
  {
    path: 'facturas/:id',
    component: FacturaDetalleComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'cajero'] }
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
