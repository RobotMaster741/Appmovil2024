import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    private firestoreService: FirestoreService
  ) { }

  async registrarUsuarioConInfo(email: string, password: string, userData: any): Promise<any> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user && user.email) {
        await this.firestoreService.guardarDatosUsuarioFirestore(user.email, userData);

        const UsuarioRegistrado = {
          names: userData.names,
          email: user.email,
          telefono: userData.telefono,
          edad: userData.edad
        };
        localStorage.setItem('UsuarioRegistrado', JSON.stringify(UsuarioRegistrado));

        this.router.navigate(['menu-principal/menu']);

        return userCredential;
      } else {
        console.error('El objeto user o user.email es nulo o indefinido después del registro');
        throw new Error('Error de registro');
      }
    } catch (error) {
      console.error('Error al registrar: ', error);
      throw error;
    }
  }

  obtenerDatosUsuarioRegistradoPorEmail(): any {
    const UsuarioRegistrado = localStorage.getItem('UsuarioRegistrado');
    if (UsuarioRegistrado) {
      return JSON.parse(UsuarioRegistrado);
    } else {
      return null;
    }
  }

  obtenerDatosUsuarioLogueado(): any {
    const UsuarioIniciadoString = localStorage.getItem('UsuarioAuth');
    if (UsuarioIniciadoString) {
      return JSON.parse(UsuarioIniciadoString);
    } else {
      return null;
    }
  }

  verificarExistenciaUsuario(email: string): Promise<boolean> {
    return this.afAuth.fetchSignInMethodsForEmail(email)
      .then(signInMethods => {
        return signInMethods.length > 0;
      });
  }

  async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  cerrarSesion(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        const itemsToRemove = ['UsuarioRegistrado', 'UsuarioAuth'];
        itemsToRemove.forEach(item => localStorage.removeItem(item));

        this.router.navigate(['login/iniciar']);
      })
  }

  enviarCorreoRecuperacion(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  iniciarSesion(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        if (user) {
          // si existe el usuario se guardara la información del usuario en el localStorage
          const UsuarioAuth = {
            email: user.email,
          };

          localStorage.setItem('UsuarioAuth', JSON.stringify(UsuarioAuth));

          const UsuarioRegistradoString = localStorage.getItem('UsuarioRegistrado');
          if (!UsuarioRegistradoString) {
            const userDataFromFirestore = await this.firestoreService.obtenerDatosUsuario(email);
            if (userDataFromFirestore) {
              localStorage.setItem('UsuarioRegistrado', JSON.stringify(userDataFromFirestore));
            }
          }

          return userCredential;
        } else {
          throw new Error('Error de inicio de sesión');
        }
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          this.mostrarMensajeError('Usuario no encontrado. Por favor, verifica el correo.');
        } else {
          this.mostrarMensajeError('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
        }
        throw error;
      });
  }
}
