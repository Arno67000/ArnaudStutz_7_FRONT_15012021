import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Tweet } from '../models/Tweet.model';

@Injectable()
export class TweetService {

    private tweets: Tweet[] = [];

    tweetSubject = new Subject<Tweet[]>();

    constructor(private httpClient: HttpClient) {}

    emitTweet() {
        this.tweetSubject.next(this.tweets.slice());
    };

    getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', 'Bearer '+ token);    
    }

    getAll() {
        const headers = this.getHeaders();
        this.httpClient
            .get<any[]>('http://localhost:3000/tweets', { headers: headers })
            .subscribe(
                (data) => {
                    this.tweets = data;
                    this.emitTweet();
                },
                (error: any) => { console.log(error) }
            );
    };

    postTweet(tweet: Tweet) {
        const headers = this.getHeaders();
        this.httpClient
            .post<Tweet>('http://localhost:3000/tweets', tweet, { headers: headers })
            .subscribe(
                (tweet) => {
                    console.log('Message posté !!');
                    this.tweets.splice(0,0,tweet);
                    this.emitTweet();
                },
                (error: any) => { console.log(error) }
            );
    };

    deleteTweet(tweetId:string) {
        const headers = this.getHeaders();
        this.httpClient
            .delete('http://localhost:3000/tweets/'+tweetId, { headers: headers })
            .subscribe(
                (obj:any) => {
                    console.log(JSON.stringify(obj));
                    this.tweets = this.tweets.filter(tweet => tweet.id !== tweetId);
                    this.emitTweet();
                },
                (error:any) => { console.log(error) }
            );
    };

    modifyTweet(tweetId:string, tweet:Tweet) {
        const headers = this.getHeaders();
        this.httpClient
            .put<Tweet>('http://localhost:3000/tweets/'+tweetId, tweet, { headers: headers })
            .subscribe(
                (newTweet) => {
                    let x = this.tweets.findIndex(tweet => tweet.id === tweetId);
                    this.tweets.splice(x,1,newTweet);
                    this.emitTweet();
                },
                (error: any) => { console.log(error) }
            );
    };
}