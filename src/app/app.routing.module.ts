import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DogsComponent } from './features/dogs/dogs.component';
import { ContactComponent } from './features/contact/contact.component';
import { AdminComponent } from './features/admin/admin.component';
import { RegisterComponent } from './features/register/register.component';
import { AuthGuard } from './features/admin/auth.guard';
import { EditAnimalComponent } from './features/editdog/editdog.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'dogs', component: DogsComponent },
  { path: 'edit/:id', component: EditAnimalComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dogs', pathMatch: 'full' } // redireciona para 'dogs' por padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
