import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userData: any = {
    edad: '',
    email: '',
    numero: '',
  }

  editMode = false;
  guardandoCambios = false;
  cambiosRealizados = false;
  estadoOriginal: any;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private navCtrl: NavController,
  ) {
    this.userData = this.authService.obtenerDatosUsuarioRegistradoPorEmail();

  }

  ngOnInit() {
    this.isLoggedIn = this.authService.obtenerDatosUsuarioLogueado();
    if (!this.userData) {
      const registeredUserData = this.authService.obtenerDatosUsuarioRegistradoPorEmail();

      if (registeredUserData) {
        this.userData = registeredUserData;
      }
    }
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

  activarEdicion() {
    this.editMode = true;
    this.estadoOriginal = { ...this.userData };
  }

  guardarCambios() {
    this.guardandoCambios = true;

    setTimeout(() => {
      this.guardandoCambios = false;
      this.editMode = false;
      this.cambiosRealizados = false;
      this.estadoOriginal = null;
    }, 2000);
  }

  cancelarEdicion() {
    if (this.cambiosRealizados) {
      this.userData = { ...this.estadoOriginal };
    }

    this.editMode = false;
    this.cambiosRealizados = false;
    this.estadoOriginal = null;
  }

  onCampoCambiado() {
    this.cambiosRealizados = true;
  }

  volverPaginaAnterior() {
    this.navCtrl.navigateForward('menu-principal/menu');
  }

  agregarProductos() {
    this.navCtrl.navigateForward('menu-principal/registro-productos');
  }

  home() {
    this.navCtrl.navigateForward('menu-principal/menu');
  }

  irARegistro() {
    this.navCtrl.navigateForward('login/registro');
  }

  irAIniciarSesion() {
    this.navCtrl.navigateForward('login/iniciar');
  }

  verProductos() {
    this.navCtrl.navigateForward('menu-principal/ver-productos')
  }
}
