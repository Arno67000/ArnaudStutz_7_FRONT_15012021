import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WallComponent } from './wall/wall.component';
import { UserService } from './services/user.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfilComponent } from './profil/profil.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './services/authGuard.service';
import { TweetService } from './services/tweet.service';

@NgModule({
  declarations: [
    AppComponent,
    WallComponent,
    UserSignupComponent,
    ProfilComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    UserService,
    AuthGuard,
    TweetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
