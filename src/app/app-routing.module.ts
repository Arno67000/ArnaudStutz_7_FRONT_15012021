import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfilComponent } from './profil/profil.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { WallComponent } from './wall/wall.component';
import { AuthGuard } from './services/authGuard.service';

const routes: Routes = [
  {path:"home", component: WallComponent},
  {path:"profil", canActivate: [AuthGuard], component: ProfilComponent},
  {path:"signup", component: UserSignupComponent},
  {path:"", component: WallComponent},
  {path:"not-found", component: NotFoundComponent},
  {path: "**", redirectTo:"/not-found"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
