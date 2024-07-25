import { NgModule, isDevMode } from '@angular/core';
import { AppRoutingModule } from './app.routing.module'; // Importe o AppRoutingModule
import { provideHttpClient, withInterceptorsFromDi, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PoComponentsModule, PoModule } from '@po-ui/ng-components';
import { BrowserModule } from '@angular/platform-browser';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AdminComponent } from './features/admin/admin.component';
import { ContactComponent } from './features/contact/contact.component';
import { RegisterComponent } from './features/register/register.component';
import { DogsComponent } from './features/dogs/dogs.component';
import { FormsModule } from '@angular/forms';
import { EditAnimalComponent } from './features/editdog/editdog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environment/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ContactComponent,
    RegisterComponent,
    EditAnimalComponent,
    DogsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    PoComponentsModule,
    PoTemplatesModule,
    PoModule,
    HttpClientModule,
    MatBottomSheetModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig )),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
