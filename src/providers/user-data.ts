import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions,Request,RequestMethod } from '@angular/http';
import { Storage } from '@ionic/storage';

declare var window: any;
@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
    private http: Http
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username: string,password: string){
    console.log(username+""+password);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept':'application/json' });
    let data :any = {user:{}};
    data.user.login = username;
    data.user.password= password;
    data.user.mobile_type = "android";
    data.user.app_version = "2.4";
    data.user.mobile_key = "0001";
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Post,
      headers: headers,
      body: JSON.stringify(data),
      url: 'http://ec2-52-66-32-175.ap-south-1.compute.amazonaws.com/users/sign_in'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          this.events.publish('user:login');
          resolve(res.json());
          this.setUsername(res.json());
           window.localStorage.setItem('loginDetails',JSON.stringify(res.json().user));
        },
        err => {
          resolve(err.json());
        }
      );
    });
    //this.storage.set(this.HAS_LOGGED_IN, true);
    //this.setUsername(username);
    //console.log(password);

    //this.events.publish('user:login');
  };



  device_deliverie(){
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept':'application/json' });
    let data :any = {};
    data.delivery_status = 0;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: headers,
      params: JSON.stringify(data),
      url: 'http://ec2-52-66-32-175.ap-south-1.compute.amazonaws.com/deliveries/device_deliveries'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res.json());
          //this.setUsername(res.json());
        },
        err => {
          resolve(err.json());
        }
      );
    });
  };

  deliveredItems(){
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept':'application/json' });
    let data :any = {};
    data.delivery_status = 2;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: headers,
      params: JSON.stringify(data),
      url: 'http://ec2-52-66-32-175.ap-south-1.compute.amazonaws.com/deliveries/device_deliveries'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res.json());
          //this.setUsername(res.json());
        },
        err => {
          resolve(err.json());
        }
      );
    });
  };

    canceledItems(){
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept':'application/json' });
    let data :any = {};
    data.delivery_status = 2;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: headers,
      params: JSON.stringify(data),
      url: 'http://ec2-52-66-32-175.ap-south-1.compute.amazonaws.com/deliveries/device_deliveries'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res.json());
          //this.setUsername(res.json());
        },
        err => {
          resolve(err.json());
        }
      );
    });
  };



  signup(username: string, email: string, phone: string, password: string){
    this.storage.set(this.HAS_LOGGED_IN, true);
    //this.setUsername(username);
    console.log(username+""+email+""+phone+""+password);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let data :any = {};
    data.username = username;
    data.email = email;
    data.phone = phone;
    data.password = password;
    //this.events.publish('user:signup');
    let options = new RequestOptions({ 
      method: RequestMethod.Post,
      headers: headers,
      body: JSON.stringify(data),
      url: 'https://enbake.herokuapp.com/signup'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          resolve(err.json());
        }
      );
    });
  };

  resetPassword(email: string){
    console.log(email);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ 
      method: RequestMethod.Post,
      headers: headers,
      body: JSON.stringify({email}),
      url: 'https://enbake.herokuapp.com/forgetPassword'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res.json());
        },
        err => {
          resolve(err.json());
        }
      );
    });
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(user_details: any): void {
      //window.localStorage.setItem('user_details', JSON.stringify(user_details.message));
      console.log(user_details);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}