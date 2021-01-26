import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/User.model';

@Injectable()
export class UserService {

    private user: User = {
        pseudo: "Invité",
        firstName: "",
        lastName: "",
        password: "#####",
        isAuth: false
    };

    headers: HttpHeaders;

        
    userSubject = new Subject<User>();

    constructor(private httpClient: HttpClient,
                private routeur: Router) {
                    const token = localStorage.getItem('token');
                    this.headers = new HttpHeaders().set('Authorization', 'Bearer '+ token);
                }

    emitUser() {
        this.userSubject.next(this.user);
    }

    signupUser(user: User) {
        this.httpClient
            .post('http://localhost:3000/user/signup',user)
            .subscribe(
                (obj: any) => {
                    console.log(obj);
                    this.loginUser(user.pseudo, user.password);
                },
                (error: any) => {
                    if(error.status === 403) {
                        alert('Pseudo déjà utilisé, veuillez en choisir un autre !!!')
                    }
                    console.log(error);
                }
            )
    }
    loginUser(pseudo: string, password: string) {
        let newUser = {pseudo: pseudo, password: password}
        this.httpClient
            .post<User>('http://localhost:3000/user/login',newUser)
            .subscribe(
                (obj: User) => {
                    this.user.pseudo = obj.pseudo;
                    this.user.firstName = atob(obj.firstName);
                    this.user.lastName = atob(obj.lastName);
                    this.user.id = obj.id;
                    if(obj.token) {
                        localStorage.setItem('token', obj.token);
                        this.user.isAuth = true;
                        this.user.password= "verified",
                        this.user.token= "yes"
                    }
                    console.log(this.user);
                    this.emitUser();
                },
                (error: any) => {
                    console.log(error);
                    if(error.status === 404) {
                        alert("Aucun compte utilisateur n'existe avec ce pseudo");
                    } else if (error.status === 403 ) {
                        alert("Mot de passe incorrect !!!");
                    } else if (error.status === 429) {
                        alert("Trop de tentatives de connections!! Réessayer dans 15 min !!")
                    } else {
                        alert( error );
                    }
                }
            );
    }
    deleteUser(id:string) {
        const token = localStorage.getItem('token');
        this.headers = new HttpHeaders().set('Authorization', 'Bearer '+ token);
        this.httpClient
            .delete('http://localhost:3000/user/'+id, { headers: this.headers })
            .subscribe(
                (obj: Object) => {
                    console.log(obj);
                    this.user = {
                        pseudo: "Invité",
                        firstName: "",
                        lastName: "",
                        password: "",
                        id: "",
                        token: "no",
                        isAuth: false
                    };
                    localStorage.clear();
                    alert('Compte utilisateur supprimé, GoodBye !!');
                    this.routeur.navigate(["/home"]);
                },
                (error: any) => {
                    console.log(error);
                }
            );
    }
}