import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/autenticacion/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  names: string = '';
  email: string = '';
  telefono: string = '';
  edad: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  validarPassword(password: string): boolean {
    if (password.length < 6) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if ((password.match(/[0-9]/g) || []).length < 2) {
      return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return false;
    }
    return true;
  }

  async registrar() {
    if (this.password !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden.', 'danger');
      return;
    }

    if (!this.names || !this.email || !this.telefono || !this.edad || !this.password) {
      this.presentToast('Por favor, complete todos los campos.', 'danger');
      return;
    }

    if (!this.validarPassword(this.password)) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 2 números y 1 carácter especial.', 'danger');
      return;
    }

    try {
      await this.authService.registrarUsuarioConInfo(this.email, this.password, {
        names: this.names,
        email: this.email,
        telefono: this.telefono,
        edad: this.edad,
      });
      this.navCtrl.navigateForward('menu-principal/perfil');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.presentToast('Este correo ya está en uso.', 'danger');
      } else {
        this.presentToast('Error al registrar. Inténtalo de nuevo.', 'danger');
      }
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    toast.present();
  }
}
