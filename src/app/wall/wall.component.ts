import { Component,  OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../models/User.model';
import { UserService } from '../services/user.service';
import { Tweet } from '../models/Tweet.model';
import { TweetService } from '../services/tweet.service';


@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})

export class WallComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  user: User = {
    pseudo: "Connection",
    firstName: "",
    lastName: "",
    password: "",
    role: 'guest',
    isAuth: false
  };

  postForm: FormGroup;
  changeForm: FormGroup;
  filterForm: FormGroup;

  tweets: Tweet[] = [
    {
      user: this.user,
      content: "Pas de messages pour l'instant, n'hésitez pas à poster quelque-chose ;) !!",
      date: new Date(),
    }
  ];

  tweetSubscription: Subscription;

  editMode: boolean = false;
  filter: string = "Pas de filtre actif";

  constructor(private userService: UserService,
              private tweetService: TweetService,
              private formBuilder: FormBuilder) { 

    this.userSubscription = this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
    this.userService.emitUser();

    this.tweetSubscription = this.tweetService.tweetSubject.subscribe((tweets: Tweet[]) => {
      this.tweets = tweets;
    })
    this.tweetService.emitTweet();


    this.postForm = this.formBuilder.group({
      postTweet: ["", Validators.required]
    });
    this.changeForm = this.formBuilder.group({
      changeTweet: ["", Validators.required]
    });
    this.filterForm = this.formBuilder.group({
      filterPseudo: ["", Validators.required]
    });
  };

  ngOnInit(): void {};
  
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.tweetSubscription.unsubscribe();
  };

  onPost() {
    const formValue = this.postForm.value;
    const tweet: Tweet = {
      content: formValue['postTweet'],
      user: this.user,
    };
    this.tweetService.postTweet(tweet);  
  };

  onDeleteTweet(i: number) {
    const tweetId = this.tweets[i].id;
    if (tweetId) {
      this.tweetService.deleteTweet(tweetId);
    } else {
      alert("ID du message introuvable... veuillez réessayer après avoir recharger la page.");
    }
  };

  onKillTweet(i:number) {
    const tweetId = this.tweets[i].id;
    const tweetUser = this.tweets[i].user;
    const tweet:Tweet = {
      content: "Le contenu de ce message à été supprimé par le modérateur du site pour non-respect des C.G.U .",
      user: tweetUser
    }
    if (tweetId) {
      this.tweetService.modifyTweet(tweetId, tweet);
    } else {
      alert("ID du message introuvable... veuillez réessayer après avoir recharger la page.");
    }
  };

  onChangeTweet(i: number) {
    const formValue = this.changeForm.value;
    const tweetId = this.tweets[i].id;
    const tweet:Tweet = {
      content: formValue['changeTweet'],
      user: this.user,
    }
    if (tweetId) {
      this.tweetService.modifyTweet(tweetId, tweet);
    } else {
      alert("ID du message introuvable... veuillez réessayer après avoir recharger la page.");
    }
    this.editMode = false;
  };

  onEditMode(i:number) {
    this.editMode = true;
    const tweetContent = this.tweets[i].content;
    this.changeForm.setValue({changeTweet: tweetContent});
  };

  onExitEditMode() {
    this.editMode = false;
  };

  onFilterMine() {
    this.tweets = this.tweets.filter(tweet => tweet.user.id === this.user.id);
    this.filter = "Filtre : Mes messages.";
  };

  onStopFilter() {
    this.tweetService.emitTweet();
    this.filter = "Pas de filtre actif";
  };

  onFilterByPseudo() {
    const pseudo = this.filterForm.value['filterPseudo'];
    this.tweets = this.tweets.filter(tweet => tweet.user.pseudo === pseudo);
    this.filter = "Filtre : Messages de "+pseudo;
    if (this.tweets.length === 0) {
      alert("Le pseudo n'est pas attribué OU aucun message n'a été posté par cet utilisateur. Essayez avec un autre pseudo !");
      this.tweetService.emitTweet();
      this.filter = "Pas de filtre actif";
    }
  };
}
