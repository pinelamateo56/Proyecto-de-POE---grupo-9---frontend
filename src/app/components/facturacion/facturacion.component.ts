import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { Cliente } from '../../models/cliente';
import { DetalleFactura } from '../../models/factura';
import { ProductosService } from '../../services/productos.service';
import { FacturasService } from '../../services/facturas.service';
import { ClientesService } from '../../services/clientes.service';
import { CartService } from '../../services/cart.service';
import { PagoConfirmado } from '../pago-modal/pago-modal.component';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  @ViewChild('inputCodigo') inputCodigo!: ElementRef<HTMLInputElement>;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  textoBusqueda: string = '';
  productoSeleccionado: Producto | null = null;
  cantidadAgregar: number = 1;
  mostrarDropdown: boolean = false;

  cedulaCliente: string = '';
  clienteActual: Cliente | null = null;
  clienteNoEncontrado: boolean = false;

  mostrarFormularioCliente: boolean = false;
  nuevoClienteNombre: string = '';
  nuevoClienteTelefono: string = '';
  nuevoClienteCorreo: string = '';

  detalles: (DetalleFactura & { nombre?: string })[] = [];
  total: number = 0;
  mensaje: string = '';
  mensajeTipo: string = '';

  modalPagoVisible: boolean = false;

  constructor(
    private productosService: ProductosService,
    private facturasService: FacturasService,
    private clientesService: ClientesService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarEstadoPersistido();
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe(data => {
      this.productos = data.filter(p => p.stock_actual > 0);
    });
  }

  cargarEstadoPersistido() {
    this.detalles = this.cartService.getCart();
    this.recalcularTotal();

    const clienteGuardado = this.cartService.getCliente();
    if (clienteGuardado) {
      this.clienteActual = clienteGuardado as Cliente;
      this.cedulaCliente = clienteGuardado.cedula;
    }
  }

  filtrarProductos() {
    if (!this.textoBusqueda.trim()) {
      this.productosFiltrados = [];
      this.mostrarDropdown = false;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.codigo_barra.toLowerCase().includes(texto)
    ).slice(0, 10);
    this.mostrarDropdown = this.productosFiltrados.length > 0;
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
    this.textoBusqueda = producto.nombre;
    this.mostrarDropdown = false;
    this.cantidadAgregar = 1;
  }

  cerrarDropdown() {
    setTimeout(() => {
      this.mostrarDropdown = false;
    }, 200);
  }

  agregarAlCarrito() {
    if (!this.productoSeleccionado) {
      this.mostrarMensaje('Seleccione un producto', 'error');
      return;
    }

    if (this.cantidadAgregar <= 0) {
      this.mostrarMensaje('La cantidad debe ser mayor a 0', 'error');
      return;
    }

    if (this.cantidadAgregar > this.productoSeleccionado.stock_actual) {
      this.mostrarMensaje(`Stock insuficiente. Disponible: ${this.productoSeleccionado.stock_actual}`, 'error');
      return;
    }

    const existente = this.detalles.find(d => d.id_producto === this.productoSeleccionado!.id_producto);
    if (existente) {
      const nuevaCantidad = existente.cantidad + this.cantidadAgregar;
      if (nuevaCantidad > this.productoSeleccionado!.stock_actual) {
        this.mostrarMensaje(`Stock insuficiente. Disponible: ${this.productoSeleccionado!.stock_actual}`, 'error');
        return;
      }
      existente.cantidad = nuevaCantidad;
      existente.subtotal = existente.cantidad * existente.precio_unitario;
    } else {
      this.detalles.push({
        id_producto: this.productoSeleccionado.id_producto,
        cantidad: this.cantidadAgregar,
        precio_unitario: Number(this.productoSeleccionado.precio_venta),
        subtotal: this.cantidadAgregar * Number(this.productoSeleccionado.precio_venta),
        nombre: this.productoSeleccionado.nombre
      });
    }

    this.recalcularTotal();
    this.guardarEstado();
    this.productoSeleccionado = null;
    this.textoBusqueda = '';
    this.cantidadAgregar = 1;
    this.mensaje = '';
  }

  buscarCliente() {
    if (!this.cedulaCliente.trim()) {
      this.clienteActual = null;
      this.clienteNoEncontrado = false;
      this.mostrarFormularioCliente = false;
      this.cartService.clearCliente();
      return;
    }

    this.clientesService.buscarPorCedula(this.cedulaCliente.trim()).subscribe({
      next: (cliente) => {
        this.clienteActual = cliente;
        this.clienteNoEncontrado = false;
        this.mostrarFormularioCliente = false;
        this.cartService.saveCliente(cliente);
      },
      error: () => {
        this.clienteActual = null;
        this.clienteNoEncontrado = true;
        this.mostrarFormularioCliente = true;
        this.cartService.clearCliente();
      }
    });
  }

  usarConsumidorFinal() {
    this.cedulaCliente = '0000000000';
    this.mostrarFormularioCliente = false;
    this.clientesService.buscarPorCedula('0000000000').subscribe({
      next: (cliente) => {
        this.clienteActual = cliente;
        this.clienteNoEncontrado = false;
        this.cartService.saveCliente(cliente);
      },
      error: () => {
        this.clienteActual = null;
        this.clienteNoEncontrado = true;
      }
    });
  }

  registrarClienteRapido() {
    if (!this.nuevoClienteNombre.trim()) {
      this.mostrarMensaje('El nombre es requerido para registrar el cliente', 'error');
      return;
    }

    const nuevoCliente = {
      cedula: this.cedulaCliente.trim(),
      nombre: this.nuevoClienteNombre.trim(),
      telefono: this.nuevoClienteTelefono.trim() || undefined,
      correo: this.nuevoClienteCorreo.trim() || undefined
    };

    this.clientesService.createCliente(nuevoCliente).subscribe({
      next: (cliente) => {
        this.clienteActual = cliente;
        this.clienteNoEncontrado = false;
        this.mostrarFormularioCliente = false;
        this.cartService.saveCliente(cliente);
        this.mostrarMensaje('Cliente registrado exitosamente', 'exito');
      },
      error: (err: any) => {
        this.mostrarMensaje(err.error?.error || 'Error al registrar cliente', 'error');
      }
    });
  }

  cancelarRegistroCliente() {
    this.mostrarFormularioCliente = false;
    this.nuevoClienteNombre = '';
    this.nuevoClienteTelefono = '';
    this.nuevoClienteCorreo = '';
  }

  bloquearCedula(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) return;
    if (event.key === 'Enter') return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  filtrarCedula() {
    this.cedulaCliente = this.cedulaCliente.replace(/\D/g, '').substring(0, 10);
  }

  bloquearTelefono(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowedKeys.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  filtrarTelefono() {
    this.nuevoClienteTelefono = this.nuevoClienteTelefono.replace(/\D/g, '').substring(0, 10);
  }

  actualizarCantidad(index: number, nuevaCantidad: number) {
    if (nuevaCantidad <= 0) {
      this.quitarDetalle(index);
      return;
    }

    const detalle = this.detalles[index];
    const producto = this.productos.find(p => p.id_producto === detalle.id_producto);

    if (producto && nuevaCantidad > producto.stock_actual) {
      this.mostrarMensaje(`Stock insuficiente. Disponible: ${producto.stock_actual}`, 'error');
      return;
    }

    detalle.cantidad = nuevaCantidad;
    detalle.subtotal = detalle.cantidad * detalle.precio_unitario;
    this.recalcularTotal();
    this.guardarEstado();
  }

  quitarDetalle(index: number) {
    this.detalles.splice(index, 1);
    this.recalcularTotal();
    this.guardarEstado();
  }

  recalcularTotal() {
    this.total = this.detalles.reduce((sum, d) => sum + d.subtotal, 0);
  }

  guardarEstado() {
    this.cartService.saveCart(this.detalles);
  }

  abrirModalPago() {
    if (this.detalles.length === 0) {
      this.mostrarMensaje('Agregue al menos un producto al carrito', 'error');
      return;
    }

    if (!this.clienteActual) {
      this.mostrarMensaje('Seleccione un cliente válido o use Consumidor Final', 'error');
      return;
    }

    this.modalPagoVisible = true;
  }

  cancelarPago() {
    this.modalPagoVisible = false;
  }

  confirmarPago(pago: PagoConfirmado) {
    this.modalPagoVisible = false;

    const facturaRequest = {
      id_cliente: this.clienteActual!.id_cliente,
      cliente_identificacion: this.clienteActual!.cedula,
      metodo_pago: pago.metodo,
      monto_recibido: pago.monto_recibido || null,
      cambio: pago.cambio || null,
      detalles: this.detalles.map(d => ({
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      }))
    };

    this.facturasService.crearFactura(facturaRequest).subscribe({
      next: (resp) => {
        let msg = `Factura ${resp.factura.numero_factura} registrada exitosamente. Total: $${resp.factura.total_pagar}`;
        if (resp.alerta_reorden) {
          const nombres = resp.productos_reabastecer.map(p => p.nombre).join(', ');
          msg += `. ALERTA: Productos por reabastecer: ${nombres}`;
        }
        this.mostrarMensaje(msg, 'exito');
        this.detalles = [];
        this.total = 0;
        this.clienteActual = null;
        this.cedulaCliente = '';
        this.clienteNoEncontrado = false;
        this.cartService.clearCart();
        this.cartService.clearCliente();
        this.cargarProductos();
      },
      error: (err) => {
        this.mostrarMensaje(`Error al registrar la factura: ${err.error?.error || err.message}`, 'error');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: string) {
    this.mensaje = texto;
    this.mensajeTipo = tipo;
    setTimeout(() => this.mensaje = '', 5000);
  }
}
