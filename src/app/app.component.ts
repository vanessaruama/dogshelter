import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isAdmin: boolean = false; // Define a lógica de autenticação real aqui

  constructor(private router: Router) {
    // Aqui você configuraria a lógica real para determinar se o usuário é um administrador
    this.checkIfAdmin();
  }

  redirectTo(route: string): void {
    this.router.navigate([route]);
  }

  openWhatsApp(): void {
    const phoneNumber = '5511982028958'; // Substitua pelo número de telefone
    const message = 'Olá, gostaria de saber mais informações sobre os dogs.'; // Mensagem opcional
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); // Abre o link em uma nova aba
  }

  redirectToRegister(): void {
    if (this.isAdmin) {
      this.redirectTo('/register');
    } else {
      alert('Você não tem permissão para acessar esta página.');
    }
  }

  checkIfAdmin(): void {
    // Implementar a lógica para verificar se o usuário é um administrador
    // Exemplo fictício:
    this.isAdmin = true; // Substitua por sua lógica real
  }
}
