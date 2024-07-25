import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { PoSearchLiterals } from '@po-ui/ng-components';

interface Animal {
  name: string;
  race: string;
  image: string; // imagem base64
  id: string;
}

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css']
})
export class DogsComponent implements OnInit {
  animals: Animal[] = [];
  isAdmin: boolean = false;
  filteredAnimals: any[] = [];
  customLiterals: PoSearchLiterals = {
    search: 'Buscar por nome, raça...',
    clean: 'Limpar',
  };

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('isLoggedIn') === 'true';

    this.getAnimals();
  }

  getAnimals(): void {
    this.http.get<Animal[]>(`${this.apiUrl}/animals`)
      .subscribe(data => {
        this.animals = data;
        this.filteredAnimals = [...this.animals];
      }, error => {
        console.error('Erro ao recuperar lista', error);
      });
  }

  deleteAnimal(id: string): void {
    this.http.delete(`${this.apiUrl}/animals/${id}`)
      .subscribe(response => {
        console.log('Deleção de registro feita com sucesso', response);
        this.getAnimals();
        this.animals = this.animals.filter(animal => animal.id !== id);
      }, error => {
        console.error('Erro ao excluir o cadastro', error);
      });
  }

  editAnimal(id: string): void {
    if (id) {
      this.router.navigate([`/edit/${id}`]); // Navega para a tela de edição com o id
    } else {
      console.error('ID não definido, não foi possível editar o registro.');
    }
  }

  onSearch(event: any): void {
    console.log(event);
    const lowerCaseQuery = event.toLowerCase();

    if (event.trim() === '') {
      this.filteredAnimals = [...this.animals];
    } else {
      this.filteredAnimals = this.animals.filter(animal =>
        animal.name.toLowerCase().includes(lowerCaseQuery) ||
        animal.race.toLowerCase().includes(lowerCaseQuery)
      );
    }
  }

}
