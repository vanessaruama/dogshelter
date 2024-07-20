import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PoNotification, PoNotificationService, PoUploadComponent } from '@po-ui/ng-components';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedFile: string | null = null;
  animal = {
    name: '',
    race: ''
  };

  constructor(private http: HttpClient, private router: Router, private poNotification: PoNotificationService) {}
  @ViewChild(PoUploadComponent) poUpload!: PoUploadComponent;

  ngOnInit(): void {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
      this.router.navigate(['/register']); // Redireciona para a tela de login se não estiver logado
    }

    this.resetForm();
  }

  onFileChange(event: any): void {
    if (event && event.length > 0) {
      const file = event[0].rawFile;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFile = e.target.result; // base64 string
          console.log(this.selectedFile);
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Nenhum arquivo selecionado');
      }
    }
  }

  register(): void {
    if (this.selectedFile) {
      const animalData = {
        name: this.animal.name,
        race: this.animal.race,
        image: this.selectedFile,
        id: uuidv4(), // Gera um ID único
      };

      console.log(animalData);
      this.http.post('http://localhost:3001/animals', animalData)
        .subscribe({
          next: response => {
            this.poNotification.success(`Doguinho cadastrado`);
            console.log('Animal cadastrado.', response);
            this.resetForm(); // Redefine o formulário após a conclusão do POST
            this.router.navigate(['/register']);
          },
          error: error => {
            console.error('Erro ao cadastrar o animal. Erro: ', error);
          }
        });
    } else {
      console.error('No image selected');
    }
  }
  resetForm(): void {
    this.selectedFile = null;
    this.animal.name = '';
    this.animal.race = '';

    if (this.poUpload) {
      this.poUpload.clear(); // Limpa o componente po-upload
    }
  }
};
