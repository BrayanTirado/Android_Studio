import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

// ✅ Importaciones correctas de Firebase (sin @angular/fire)
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonIcon
  ],
})
export class RegisterPage implements OnInit {  
  nombres: string = '';
  apellidos: string = '';
  edad: number | null = null;
  sexo: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  // ✅ Método de registro (con validaciones y guardado en Firestore)
  async registrarse() {
    if (
      !this.nombres.trim() ||
      !this.apellidos.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    if (!this.email.includes('@') || !this.email.includes('.')) {
  alert('Por favor ingresa un correo electrónico válido.');
  return;
}
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );
      const user = userCredential.user;

      const db = getFirestore();
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombres: this.nombres,
        apellidos: this.apellidos,
        edad: this.edad,
        sexo: this.sexo,
        email: this.email,
        fechaRegistro: new Date().toISOString(),
      });

      alert('Registro exitoso 🎉');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert('Error al registrar: ' + (error?.message ?? error));
    }
  }

  // ✅ Redirección al login
  irALogin() {
    this.router.navigate(['/login']);
  }
}
