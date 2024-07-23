import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

// Defina o tipo Animal com as propriedades que você espera
interface Animal {
  id: string;
  name: string;
  race: string;
  image?: string;
}

@Component({
  selector: 'app-edit-animal',
  templateUrl: './editdog.component.html',
  styleUrls: ['./editdog.component.css']  // Corrigido para .css
})
export class EditAnimalComponent implements OnInit {
  animal: any = {};
  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.http.get<Animal>(`${this.apiUrl}/animals/${id}`)
        .subscribe({
          next: data => {
            this.animal = data;
          },
          error: error => {
            console.error('Error fetching animal:', error);
          }
        });
    } else {
      console.error('No animal ID provided');
    }
  }

  updateAnimal(): void {
    if (this.animal && this.animal.id) {
      this.http.put(`${this.apiUrl}/animals/${this.animal.id}`, this.animal)
        .subscribe({
          next: response => {
            console.log('Animal updated successfully:', response);
            this.router.navigate(['/dogs']);
          },
          error: error => {
            console.error('Error updating animal:', error);
          }
        });
    } else {
      console.error('Animal ID is missing or animal data is incomplete');
    }
  }

  cancel(): void {
    this.router.navigate(['/dogs']); // Redireciona para a página de listagem de animais
  }

  onFileChange(event: any): void {
    const file = event[0].rawFile;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.animal.image = e.target.result; // Atualiza a imagem do animal
      };
      reader.readAsDataURL(file);
    }
  }
}
