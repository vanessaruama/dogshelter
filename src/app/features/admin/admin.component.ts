import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent | undefined;

  userLogin: string = '';
  userPassword: string  = '';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('isLoggedIn') === 'true';

    if (this.isAdmin) {
      this.router.navigate(['/register']); // Redireciona para a tela de cadastro
    }
  }

  confirmAction() {
    this.authService.login(this.userLogin, this.userPassword)
    .then(() => {
      this.poNotification.success(`Login realizado pelo e-mail: ${this.userLogin}!`);
      setTimeout(() => {
        this.loginSuccess()
        this.router.navigate(['/register']); // Redireciona para a página de cadastro
      }, 200);
    })
    .catch(() => {
      this.poNotification.error('Login não foi realizado!');
    });
  }

  loginSuccess(): void {
    sessionStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/register']); // Redireciona para a tela de cadastro
  }

}
