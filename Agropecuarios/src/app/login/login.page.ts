import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule, IonIcon]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  constructor(private router: Router) { }

  ngOnInit() {
  }
  acceder() {
    if (this.email.trim() === '') {
      alert('Por favor ingresa tu correo electrónico.');
    } else {
      alert(`Accediendo con el correo: ${this.email} y contraseña: ${this.password}`);
    }
  }
  async loginConGoogle() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // Opcional: guarda datos adicionales en Firestore
      console.log('Usuario con Google:', user.displayName, user.email);

      alert(`Bienvenido, ${user.displayName || user.email}`);

      // Redirige al Home o donde desees
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      alert('No se pudo iniciar sesión con Google: ' + (error.message || error));
    }
  }

  registrarse() {
    this.router.navigate(['/register']);
  }
}
