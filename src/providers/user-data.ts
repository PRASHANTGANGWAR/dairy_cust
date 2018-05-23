import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions,Request,RequestMethod } from '@angular/http';
import { Storage } from '@ionic/storage';

declare var window: any;
@Injectable()
export class UserData {
  // public url : string = false;
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
 // Url = "http://ec2-13-126-16-236.ap-south-1.compute.amazonaws.com";
  Url = "http://ec2-13-127-218-92.ap-south-1.compute.amazonaws.com";

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
    data.user.app_version = "2.3";
    data.user.mobile_key = "0001";
  /*  data.user.app_version = "2.1";
    data.user.mobile_key = "0000";*/
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Post,
      headers: headers,
      body: JSON.stringify(data),
      url: this.Url+'/users/sign_in'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res.json());
          this.setUsername(res.json());
           window.localStorage.setItem('loginDetails',JSON.stringify(res.json().user));
           window.localStorage.setItem('App',"CombinedApp");
           this.events.publish('user:login');
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


  collections(){
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
    let data :any = {};
    data.d_boy_mobile = user.mobile;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: data,
      url: this.Url+'/payments/customer_payment_status'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res);
          //this.setUsername(res.json());
        },
        err => {
          resolve(err);
        }
      );
    });
  };


    snoozed_payments(){
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
    let data :any = {};
    data.d_boy_mobile = user.mobile;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: data,
      url: this.Url+'/users/snoozed_customers'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res);
          //this.setUsername(res.json());
        },
        err => {
          resolve(err);
        }
      );
    });
  };

   pendingsnoozed_payments(){
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
    let headers = new Headers({ 
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'X-User-Mobile':user.mobile,
      // 'X-d_boy_mobile':user.mobile,
      'X-User-Token': user.authentication_token,
      'pending': true
    });
    let data :any = {};
    data.d_boy_mobile = user.mobile;
    data.pending =true;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: headers,
      params: data,
      url: this.Url+'/users/snoozed_customers'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res);
          //this.setUsername(res.json());
        },
        err => {
          resolve(err);
        }
      );
    });
  };


  urgentCollections(){
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
    let data :any = {};
    data.d_boy_mobile = user.mobile;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: data,
      url: this.Url+'/payments/cancel_order_payments'
    });
    return new Promise(resolve => {
      this.http.request(new Request(options))
      .subscribe(
        res => {
          resolve(res);
          //this.setUsername(res.json());
        },
        err => {
          resolve(err);
        }
      );
    });
  };

  boxCollections(){
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
    let data :any = {};
    data.d_boy_mobile = user.mobile;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: data,
      url: this.Url+'/delivery_boxes/recieve_box_customers'
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
  }

  lastDeliveries(cusotmerId: any){
    let data :any = {};
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: data,
      url: this.Url+'/users/'+cusotmerId+'/customer_deliveries_history'
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
  }

  lastPayments(cusotmerId: any) {
    let data :any = {};
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: data,
      url: this.Url+'/users/'+cusotmerId+'/customer_payment_history'
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

  }

  paynow(id: any,due: any,bill: any,deviceId: any,payment: any) {
    let a = parseInt(payment);
    console.log(due);
    console.log(bill);
    let data :any = {};
    // data.d_boy_mobile = user.mobile;
    data = {
      customer_id: id,
      cash_paid: a, 
      device_id: deviceId
    }
    let options = new RequestOptions({ 
      method: RequestMethod.Post,
      headers: this.getHeader(),
      body: data,
      url: this.Url+'/payments/deposit_due_balance'
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

  }


  device_deliverie(){
    let data :any = {};
    data.delivery_status = 0;
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      params: JSON.stringify(data),
      url: this.Url+'/deliveries/device_deliveries'
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

  upload(data: any) {
    console.log(data);
    // let data2: any = {};
    let main: any = {};
    // main._json = [];
    main.delivery = {};
    main.deliveries = data;
    // main._json.push(data2);
    let options = new RequestOptions({ 
      method: RequestMethod.Put,
      headers: this.getHeader(),
      body: main,
      url: this.Url+'/deliveries/update_now'
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
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      // params: JSON.stringify(data),
      url: this.Url+'/deliveries/device_deliveries_status?delivery_status=2'
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


  boxAssign(deliveryId: any, customerId: any) {
    console.log(deliveryId);
    let data :any = {};
    data.delivery_box = {
      customer_id: customerId,
      action_type: "assign"
    };
    console.log(data);
    let options = new RequestOptions({ 
      method: RequestMethod.Post,
      headers: this.getHeader(),
      body: JSON.stringify(data),
      url: this.Url+'/delivery_boxes/customer_delivery_box/'
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
  }


    canceledItems(){
    let options = new RequestOptions({ 
      method: RequestMethod.Get,
      headers: this.getHeader(),
      //params: JSON.stringify(data),
      url: this.Url+'/deliveries/device_deliveries_status?delivery_status=1'
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

  deleveryRefund(data:any) {
    let options = new RequestOptions({
      method: RequestMethod.Put,
      headers: this.getHeader(),
      body: JSON.stringify(data),
      url: this.Url+'/shop/delivery_refund'
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
  }


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

  getLastDeliveryInfo(id:number) {
    let options = new RequestOptions({
      method: RequestMethod.Get,
      headers: this.getHeader(),
      url: this.Url+'/shop/previous_delivery?customer_id='+id
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
  }

  getHeader() {
    let user = JSON.parse(window.localStorage.getItem('loginDetails'));
    return new Headers({
      'Content-Type': 'application/json',
       'Accept':'application/json',
       'X-User-Mobile':user.mobile,
       'X-User-Token': user.authentication_token
     });
  }

  editTodayDeliveries(data:any) {
    let options = new RequestOptions({
      method: RequestMethod.Put,
      headers: this.getHeader(),
      body: JSON.stringify(data.package),
      url: this.Url+'/deliveries/'+data.Id+'/edit_today_delivery'
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
  }
}


