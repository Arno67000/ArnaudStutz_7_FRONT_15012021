import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Tweet } from '../models/Tweet.model';

@Injectable()
export class TweetService {

    private tweets: Tweet[] = [];

    tweetSubject = new Subject<Tweet[]>();

    headers: HttpHeaders;

    constructor(private httpClient: HttpClient,
                private routeur: Router) {
                    const token = localStorage.getItem('token');
                    this.headers = new HttpHeaders().set('Authorization', 'Bearer '+ token);
                }

    emitTweet() {
        this.tweetSubject.next(this.tweets.slice());
    };

    getAll() {
        this.httpClient
            .get<any[]>('http://localhost:3000/tweets')
            .subscribe(
                (data) => {
                    console.log(data);
                    this.tweets = data;
                    this.emitTweet();
                },
                (error: any) => { console.log(error) }
            );
    };

    postTweet(tweet: Tweet) {
        this.httpClient
            .post('http://localhost:3000/tweets', tweet, { headers: this.headers })
            .subscribe(
                () => {
                    console.log('Message posté !!');
                    this.getAll();
                },
                (error: any) => { console.log(error) }
            );
    };

    deleteTweet(id:string) {
        this.httpClient
            .delete('http://localhost:3000/tweets/'+id, { headers: this.headers })
            .subscribe(
                (obj:any) => {
                    console.log(obj);
                    this.getAll();
                },
                (error:any) => { console.log(error) }
            );
    };
}

