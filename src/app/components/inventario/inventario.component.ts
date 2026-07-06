import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  buscarTexto = '';
  filtroDisponibilidad = 'todos';
  modalVisible = false;
  modalParametrosVisible = false;
  modalStockVisible = false;
  productoSeleccionado: Producto | null = null;
  mensaje = '';
  mensajeTipo = '';

  stockActualizar: number = 0;
  precioActualizar: number = 0;
  stockMinimoActualizar: number = 0;

  constructor(
    private productosService: ProductosService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.aplicarFiltros();
      },
      error: () => {
        this.mostrarMensaje('Error al cargar productos', 'error');
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.productos];

    if (this.buscarTexto) {
      const texto = this.buscarTexto.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.codigo_barra.toLowerCase().includes(texto)
      );
    }

    if (this.filtroDisponibilidad === 'disponibles') {
      resultado = resultado.filter(p => p.stock_actual > p.stock_minimo);
    } else if (this.filtroDisponibilidad === 'alerta') {
      resultado = resultado.filter(p => p.stock_actual > 0 && p.stock_actual <= p.stock_minimo);
    } else if (this.filtroDisponibilidad === 'sin-stock') {
      resultado = resultado.filter(p => p.stock_actual === 0);
    }

    this.productosFiltrados = resultado;
  }

  abrirModalNuevo() {
    this.productoSeleccionado = null;
    this.modalVisible = true;
  }

  abrirModalEditar(producto: Producto) {
    this.productoSeleccionado = producto;
    this.modalVisible = true;
  }

  abrirModalParametros(producto: Producto) {
    this.productoSeleccionado = producto;
    this.precioActualizar = producto.precio_venta;
    this.stockMinimoActualizar = producto.stock_minimo;
    this.modalParametrosVisible = true;
  }

  abrirModalStock(producto: Producto) {
    this.productoSeleccionado = producto;
    this.stockActualizar = producto.stock_actual;
    this.modalStockVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.productoSeleccionado = null;
  }

  cerrarModalParametros() {
    this.modalParametrosVisible = false;
    this.productoSeleccionado = null;
  }

  cerrarModalStock() {
    this.modalStockVisible = false;
    this.productoSeleccionado = null;
  }

  guardarProducto(producto: Partial<Producto>) {
    if (this.productoSeleccionado) {
      this.productosService.updateProducto(this.productoSeleccionado.id_producto, producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto actualizado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al actualizar producto', 'error');
        }
      });
    } else {
      this.productosService.createProducto(producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto creado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al crear producto', 'error');
        }
      });
    }
  }

  guardarParametros() {
    if (!this.productoSeleccionado) return;
    this.productosService.updateParametros(
      this.productoSeleccionado.id_producto,
      this.precioActualizar,
      this.stockMinimoActualizar
    ).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModalParametros();
        this.mostrarMensaje('Parámetros actualizados exitosamente', 'exito');
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.error || 'Error al actualizar parámetros', 'error');
      }
    });
  }

  guardarStock() {
    if (!this.productoSeleccionado) return;
    this.productosService.updateStock(
      this.productoSeleccionado.id_producto,
      this.stockActualizar
    ).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModalStock();
        this.mostrarMensaje('Stock actualizado exitosamente', 'exito');
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.error || 'Error al actualizar stock', 'error');
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto eliminado exitosamente', 'exito');
        },
        error: (err) => {
          this.mostrarMensaje(err.error?.error || 'Error al eliminar producto', 'error');
        }
      });
    }
  }

  getEstadoStock(producto: Producto): string {
    if (producto.stock_actual === 0) return 'sin-stock';
    if (producto.stock_actual <= producto.stock_minimo) return 'alerta';
    return 'disponible';
  }

  getTextoEstado(producto: Producto): string {
    if (producto.stock_actual === 0) return 'Sin Stock';
    if (producto.stock_actual <= producto.stock_minimo) return 'Stock Bajo';
    return 'Disponible';
  }

  bloquearNegativos(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  bloquearCodigoBarras(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  filtrarCodigoBarras(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
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
