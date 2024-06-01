import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc, query, where, getDocs, QuerySnapshot, DocumentData, deleteDoc, doc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
  ) { }

  async guardarDatosUsuarioFirestore(email: string, userData: any) {
    const usersCollection = collection(this.firestore, 'UsuarioRegistrados');

    const UsuarioReg = {
      names: userData.names,
      email: email,
      telefono: userData.telefono,
      edad: userData.edad
    };

    try {
      await addDoc(usersCollection, UsuarioReg);
      console.log('Datos del usuario guardados en Firestore con éxito.');
    } catch (error) {
      console.error('Error al guardar los datos del usuario en Firestore:', error);
      throw error;
    }
  }

  async obtenerDatosUsuario(email: string) {
    const usuariosRegQuery = query(collection(this.firestore, 'UsuarioRegistrados'), where('email', '==', email));
    const usuariosRegSnapshot = await getDocs(usuariosRegQuery);

    if (usuariosRegSnapshot.size > 0) {
      const usuarioDoc = usuariosRegSnapshot.docs[0];
      const usuarioData = usuarioDoc.data();
      return usuarioData;
    } else {
      return null;
    }
  }

  async agregarProductos(datosProductos: any) {
    const user = await this.afAuth.currentUser;

    if (user) {
      const userEmail = user.email;

      datosProductos.propietario = userEmail;

      await addDoc(collection(this.firestore, 'ProductosRegistrados'), datosProductos);
      window.location.reload();
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async obtenerDatosDelProducto(email: string) {
    const productosRegQuery = query(collection(this.firestore, 'ProductosRegistrados'), where('propietario', '==', email));
    const prodcutosRegSnapshot = await getDocs(productosRegQuery);

    if (prodcutosRegSnapshot.size > 0) {
      const productoDoc = prodcutosRegSnapshot.docs[0];
      const productoData = productoDoc.data();
      return productoData;
    } else {
      return null;
    }
  }

  obtenerProductosRegistrados(): Observable<any[]> {
    const ProductosCollection = collection(this.firestore, 'ProductosRegistrados');
    const ProductosQuery = query(ProductosCollection);

    return new Observable((observer) => {
      getDocs(ProductosQuery)
        .then((querySnapshot: QuerySnapshot<DocumentData>) => {
          const Productos: any[] = [];
          querySnapshot.forEach((doc) => {
            Productos.push(doc.data());
          });
          observer.next(Productos);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
