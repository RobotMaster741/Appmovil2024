import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-ver-detalles',
  templateUrl: './ver-detalles.page.html',
  styleUrls: ['./ver-detalles.page.scss'],
})
export class VerDetallesPage implements OnInit {
  productoSeleccionado: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService,
  ) {
    this.route.queryParams.subscribe(params => {
      const extras = this.router.getCurrentNavigation()?.extras;
      if (extras && 'state' in extras && extras.state) {
        this.productoSeleccionado = extras.state['productoSeleccionado'];
      }
    });
  }

  ngOnInit() {
  }

  Perfil() {
    this.navCtrl.navigateForward('menu-principal/perfil')
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

  home() {
    this.navCtrl.navigateForward('menu-principal/menu');
  }

}
