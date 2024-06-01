import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';
import { FirestoreService } from 'src/app/services/firebase/firestore/firestore.service';

@Component({
  selector: 'app-registro-productos',
  templateUrl: './registro-productos.page.html',
  styleUrls: ['./registro-productos.page.scss'],
})
export class RegistroProductosPage implements OnInit {

  userData: any = {};
  nombre: string | undefined = '';
  descripcion: string | undefined = '';
  stock: string | undefined = '';
  cantidad: string | undefined = '';
  costo: string | undefined = '';

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('menu-principal/perfil');
  }

  async mostrarConfirmacionCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Esta seguro de querer regresar a home?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cerrarSesion();
          },
        },
      ],
    });

    await alert.present();
  }

  cerrarSesion() {
    this.authService.cerrarSesion()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        console.error('Error al cerrar sesión: ', error);
      });
  }

  async mostrarMensajeConfirmacion() {
    // Aqui Defino un mensaje error para validar los campos vacios.
    let mensajeError = '';

    const nombre = (document.getElementById('nombreProducto') as HTMLInputElement).value;
    const descripcion = (document.getElementById('descripcionProducto') as HTMLInputElement).value;
    const stock = (document.getElementById('stock') as HTMLInputElement).value;
    const cantidad = (document.getElementById('cantidad') as HTMLInputElement).value;
    const costo = (document.getElementById('costo') as HTMLInputElement).value;


    // Aqui se verifica cada campo y que se le agregue el mensaje de error en caso que esten vacios.
    if (!nombre) {
      mensajeError += 'Nombre, ';
    }
    if (!descripcion) {
      mensajeError += 'Destino, ';
    }
    if (!stock) {
      mensajeError += 'Rut, ';
    }
    if (!cantidad) {
      mensajeError += 'Cantidad de pasajeros, ';
    }

    if (!costo) {
      mensajeError += 'Ingresar el costo de la siguiente manera: $ 12.000 ';
    }

    // Si hay campos faltantes, que se muestre un mensaje de error.
    if (mensajeError) {
      mensajeError = mensajeError.slice(0, -2);
      const toast = await this.toastController.create({
        message: `Por favor, llena los siguientes campos: ${mensajeError}`,
        duration: 10000,
        position: 'bottom',
        color: 'danger',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
              console.log('Cerrar Toast');
            },
          },
        ],
      });
      toast.present();
      //En caso que faltan campos por llenar que detenga la ejecucion
      return;
    }
    const datosVehiculo = {
      nombre: nombre,
      descripcion: descripcion,
      stock: stock,
      cantidad: cantidad,
      costo: costo
    };

    this.firestoreService.agregarProductos(datosVehiculo)
      .then(() => {
        console.log('Datos del Producto agregados con éxito a Firestore');
      })
      .catch(error => {
        console.error('Error al agregar datos del Producto a Firestore:', error);
      });
  }

  home() {
    this.navCtrl.navigateForward('menu-principal/menu');
  }

}