import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnDestroy{

  user: User = {
    pseudo: "Invité",
    firstName: "",
    lastName: "",
    password: "",
    isAuth: false
  };

  userSubscription: Subscription;
  unsubscribe: boolean = false;
  unsubscribeForm: FormGroup;
  pseudoToKill = "";

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {

            this.unsubscribeForm = this.formBuilder.group({
              unsubscribePseudo: ["",Validators.required]
            });            

            this.userSubscription = this.userService.userSubject.subscribe((user) => {
              this.user = user;
            });
            this.userService.emitUser();
            console.log(this.user);  
   }

   ngOnDestroy() {
     this.userSubscription.unsubscribe();
   }

   onAskForDelete() {
    this.unsubscribe = true;
   }
   onDeleteAccount() {
    if(this.user.id) {
      this.userService.deleteUser(this.user.id);
    } else {
      alert('ID utilisateur inexistante');
    }
  }


}
