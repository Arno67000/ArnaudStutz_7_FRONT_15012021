import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/User.model';
import { TweetService } from './tweet.service';

@Injectable()
export class UserService {
  private user: User = {
    pseudo: 'Connection',
    firstName: '',
    lastName: '',
    password: '#####',
    role: 'guest',
    isAuth: false,
  };

  userSubject = new Subject<User>();

  constructor(
    private httpClient: HttpClient,
    private routeur: Router,
    private tweetService: TweetService
  ) {
    if (localStorage.getItem('token')) {
      this.getCurrentUser();
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  emitUser() {
    this.userSubject.next(this.user);
  }

  signupUser(user: User) {
    this.httpClient.post('http://localhost:8000/user/signup', user).subscribe(
      (obj: any) => {
        console.log(obj);
        this.loginUser(user.pseudo, user.password);
      },
      (error: any) => {
        if (error.status === 400) {
          alert('Pseudo déjà utilisé, veuillez choisir un autre pseudo.');
        }
        console.log(error);
      }
    );
  }

  loginUser(pseudo: string, password: string) {
    let newUser = { pseudo: pseudo, password: password };
    this.httpClient
      .post<User>('http://localhost:8000/user/login', newUser)
      .subscribe(
        (obj: User) => {
          this.user = {
            ...obj,
            firstName: obj.firstName,
            lastName: obj.lastName,
            password: 'checked !',
            token: 'checked !',
            isAuth: true,
            role: obj.role,
          };
          if (obj.token) {
            localStorage.setItem('token', obj.token);
          }
          console.log(this.user);
          this.emitUser();
          this.tweetService.getAll();
          this.routeur.navigate(['/home']);
        },
        (error: any) => {
          if (error.status === 429) {
            alert(
              'Trop de tentatives de connections, veuillez réessayer dans 15 min... '
            );
          } else {
            alert(
              'Désolé nous avons une erreur innattendue, veuillez réessayer après avoir recharger la page svp'
            );
          }
        }
      );
  }

  logoutUser() {
    localStorage.clear();
    this.user = {
      pseudo: 'Connection',
      firstName: '',
      lastName: '',
      password: '',
      id: '',
      role: 'guest',
      token: 'no',
      isAuth: false,
    };
    this.emitUser();
    this.routeur.navigate(['/home']);
  }

  deleteUser(userId: string) {
    const headers = this.getHeaders();
    this.httpClient
      .delete('http://localhost:8000/user/' + userId, { headers: headers })
      .subscribe(
        (obj: Object) => {
          console.log(JSON.stringify(obj));
          this.user = {
            pseudo: 'Connection',
            firstName: '',
            lastName: '',
            password: '',
            id: '',
            role: 'guest',
            token: 'no',
            isAuth: false,
          };
          localStorage.clear();
          alert('Compte utilisateur supprimé, GoodBye !!');
          this.routeur.navigate(['/home']);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getCurrentUser() {
    const headers = this.getHeaders();
    this.httpClient
      .get<User>('http://localhost:8000/user/', { headers: headers })
      .subscribe(
        (user) => {
          this.user = {
            ...user,
            firstName: user.firstName,
            lastName: user.lastName,
            password: 'checked !',
            token: 'checked !',
            role: user.role,
            isAuth: true,
          };
          console.log(this.user);
          this.emitUser();
          this.tweetService.getAll();
          this.routeur.navigate(['/home']);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  modifyUserPass(
    userId: string,
    oldPass: string,
    password: string,
    pseudo: string
  ) {
    const headers = this.getHeaders();
    this.httpClient
      .put(
        'http://localhost:8000/user/' + userId,
        { oldPass, password, pseudo },
        { headers: headers }
      )
      .subscribe(
        () => {
          alert('Votre mot-de-passe à bien été modifié !!!');
          this.routeur.navigate(['/home']);
        },
        (error: any) => {
          alert(JSON.stringify(error.error.message));
        }
      );
  }
}
