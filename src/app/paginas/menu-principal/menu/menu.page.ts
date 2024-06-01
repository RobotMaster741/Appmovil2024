import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';
import { FirestoreService } from 'src/app/services/firebase/firestore/firestore.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  ProductosRegistrados: any[] = [];
  usuarioAutenticado!: boolean;
  searchTerm: string = '';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.firestoreService.obtenerProductosRegistrados().subscribe((producto) => {
      this.ProductosRegistrados = producto;
    });
    this.usuarioAutenticado = this.authService.obtenerDatosUsuarioLogueado();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
  }

  matchProduct(productoTitulo: string): boolean {
    return productoTitulo.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  verdetalle(producto: any) {
    this.router.navigate(['menu-principal/ver-detalles'], {
      state: { productoSeleccionado: producto }
    });
  }

  irARegistro() {
    this.navCtrl.navigateForward('login/registro');
  }

  irAIniciarSesion() {
    this.navCtrl.navigateForward('login/iniciar');
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

  Perfil() {
    this.navCtrl.navigateForward('menu-principal/perfil')
  }
}