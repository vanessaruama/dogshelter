import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';

interface Animal {
  name: string;
  race: string;
  image: string; // Base64 image string
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
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('isLoggedIn') === 'true';

    this.http.get<Animal[]>(`${this.apiUrl}/animals`)
      .subscribe(data => {
        this.animals = data;
        this.filteredAnimals = [...this.animals];
      });
  }

  deleteAnimal(id: string): void {
    this.http.delete(`${this.apiUrl}/animals/${id}`)
      .subscribe(response => {
        console.log('Animal deleted successfully:', response);
        this.animals = this.animals.filter(animal => animal.id !== id);
      }, error => {
        console.error('Error deleting animal:', error);
      });
  }

  editAnimal(id: string): void {
    if (id) {
      this.router.navigate([`/edit/${id}`]); // Navega para a tela de edição com o id
    } else {
      console.error('ID is undefined. Cannot navigate to edit page.');
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
