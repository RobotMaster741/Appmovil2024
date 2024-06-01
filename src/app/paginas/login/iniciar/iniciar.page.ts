import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-iniciar',
  templateUrl: './iniciar.page.html',
  styleUrls: ['./iniciar.page.scss'],
})
export class IniciarPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  async iniciarSesion() {
    // Validar que se hayan ingresado correo y contraseña
    if (!this.email.trim() || !this.password.trim()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor ingrese su correo y contraseña.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      // Intentar iniciar sesión con el servicio de autenticación
      await this.authService.iniciarSesion(this.email, this.password);
      // Si tiene éxito, navegar a la página de menú principal
      this.navCtrl.navigateForward('menu-principal/menu');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      // Mostrar un mensaje de error al usuario
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al iniciar sesión. Por favor, verifique su correo y contraseña e inténtelo nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
