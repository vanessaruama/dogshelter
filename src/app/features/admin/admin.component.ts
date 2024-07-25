import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent | undefined;

  userLogin: string | undefined;
  userPassword: string | undefined;

  primaryAction: PoModalAction = {
    label: 'Confirm',
    action: () => {
      this.confirmAction();
    }
  };
  isAdmin: boolean = false;

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('isLoggedIn') === 'true';

    if (this.isAdmin) {
      this.router.navigate(['/register']); // Redireciona para a tela de cadastro
    }
  }

  confirmAction() {
    if (this.userLogin === "ruama" && this.userPassword === "1234") {
      this.poNotification.success(`Login realizado pelo usuário ${this.userLogin}!`);
      setTimeout(() => {
        this.login()
        this.router.navigate(['/register']); // Redireciona para a página de cadastro
      }, 200);
    } else {
      this.poNotification.error(`Login não foi realizado!`);
    }
  }

  login(): void {
    // Suponha que o login seja bem-sucedido
    sessionStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/register']); // Redireciona para a tela de cadastro
  }

}
