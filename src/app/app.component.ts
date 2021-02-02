import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './models/User.model';
import { UserService } from './services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'Groupomania';
  user: User = {
    pseudo: "Connection",
    firstName: "",
    lastName: "",
    password: "",
    role: 'guest',
    isAuth: false
  };

  userSubscription: Subscription;

  userForm: FormGroup;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router) {
                this.userSubscription = this.userService.userSubject.subscribe((user) => {
                  this.user = user;
                });
                this.userService.emitUser(); 
                this.userForm = this.formBuilder.group({
                  pseudoLogin: ["", Validators.required],
                  passwordLogin: ["", Validators.required]
                })
              }

  ngOnInit() {
    
       
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogin() {
    const formValue = this.userForm.value;
    this.userService.loginUser(formValue['pseudoLogin'], formValue['passwordLogin']);
  }

  onQuit() {
    this.userService.logoutUser();
  }

  subscribeUser() {
    this.userSubscription = this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
    this.userService.emitUser();
  }

}
