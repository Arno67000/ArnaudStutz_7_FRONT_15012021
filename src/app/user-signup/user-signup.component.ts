import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent implements OnInit {

  userForm: FormGroup;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) { 
                this.userForm = this.formBuilder.group({
                  pseudo: ["", Validators.required],
                  firstName: ["", Validators.required],
                  lastName: ["", Validators.required],
                  password: ["", Validators.required],
                  checked: ["", Validators.required]
                })
              }

  ngOnInit(): void {
  }

  onSubmitForm() {
    const formValue = this.userForm.value;
    const newUser = new User(
      formValue['pseudo'],
      formValue['firstName'],
      formValue['lastName'],
      formValue['password']
    );
    console.log(newUser);
    this.userService.signupUser(newUser);
  }
  
}
