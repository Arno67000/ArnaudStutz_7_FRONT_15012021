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
export class ProfilComponent implements OnDestroy, OnInit {

  user: User = {
    pseudo: "Invité",
    firstName: "",
    lastName: "",
    password: "",
    role: "guest",
    isAuth: false
  };

  userSubscription: Subscription;
  unsubscribe: boolean = false;
  unsubscribeForm: FormGroup;
  passForm: FormGroup;


  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {

            this.unsubscribeForm = this.formBuilder.group({
              unsubscribePseudo: ["",Validators.required]
            });
            this.passForm = this.formBuilder.group({
              pass: ['', Validators.required],
              newPass1: ['', Validators.required],
              newPass2: ['', Validators.required]
            })         

            this.userSubscription = this.userService.userSubject.subscribe((user) => {
              this.user = user;
            });
            this.userService.emitUser(); 
   }

   ngOnInit() {};

   ngOnDestroy() {
     this.userSubscription.unsubscribe();
   };

   checkingPseudo() {
     const pseudo = this.unsubscribeForm.value['unsubscribePseudo'];
     if (pseudo === this.user.pseudo) {
       return true;
     } else {
       return false;
     };
   };

   onAskForDelete() {
    this.unsubscribe = true;
   };

   onDeleteAccount() {
     const valid = this.checkingPseudo();
     if(valid) {
        if(this.user.id) {
          this.userService.deleteUser(this.user.id);
        } else {
          alert('ID utilisateur inexistante');
        }
     } else {
       alert('Pseudo invalide !!!');
     }  
  };

  onChangePass() {
    const valid = this.checkingNewPass();
    const userId = this.user.id;
    const currentPass = this.passForm.value['pass'];
    const newPass = this.passForm.value['newPass2'];
    if (valid && userId) {
      this.userService.modifyUserPass(userId, currentPass, newPass);
    } else {
      console.log('Erreur vérification du Mot-de-passe.');
    }
    
  }

  checkingNewPass() {
    const pass = this.passForm.value['pass'];
    const pass1 = this.passForm.value['newPass1'];
    const pass2 = this.passForm.value['newPass2'];
    if (pass === pass1) {
      alert("Votre nouveau mot-de-passe ne peut pas être le même que l'ancien !!");
      return false;
    } else if (pass1 !== pass2) {
      alert('Votre champ de confirmation du nouveau Mot-de-passe est incorrect !! Veuillez confirmer votre nouveau Mot-de-passe svp.');
      return false;
    } else {
      return true;
    }
  }

}
