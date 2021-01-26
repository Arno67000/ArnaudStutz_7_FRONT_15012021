import { Component, OnDestroy, OnInit } from '@angular/core';
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
    pseudo: "Invité",
    firstName: "",
    lastName: "",
    password: "",
    isAuth: false
  };

  postForm: FormGroup;

  tweets: Tweet[] = [
    {
      user: this.user,
      content: "Pas de messages pour l'instant, n'hésitez pas à poster quelque-chose ;) !!",
      date: new Date(),
    }
  ];

  tweetSubscription: Subscription;

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
    })

  };

  ngOnInit(): void {
    this.getAllTweets();
  };
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
    this.tweetService.emitTweet();    
  }

  getAllTweets() {
    this.tweetService.getAll();
  }

  onDeleteTweet(i: number) {
    const id = this.tweets[i].id;
    if (id) {
      this.tweetService.deleteTweet(id);
    } else {
      alert("ID du message introuvable... veuillez réessayer après avoir recharger la page.");
    }
  }

}
