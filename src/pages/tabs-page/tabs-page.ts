import { Component } from '@angular/core';

import { UserData } from '../../providers/user-data';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DBProvider } from '../../providers/DBProvider';
import { MenuController, AlertController, LoadingController} from 'ionic-angular';
//import * as _ from 'underscore';
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  AppUsers: any=[];
  Products: any=[];
  //Products: any=[];
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = SpeakerListPage;
  tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
  private loading :any;
  mySelectedIndex: number;

  constructor(public menu: MenuController, public userData: UserData, private _loading: LoadingController, private sqlite: SQLite,public db: DBProvider,private _alert: AlertController) {
    this.menu.enable(true, 'loggedInMenu');
  }
  ionViewDidLoad() {
    // this.deleteAppUser();
    //this.insertAppUser();
    this.getAllAppUsers();
  }
  public deleteAppUser() {
    this.db.deleteAppUser()
      .then(data => {
        if (data.res.rowsAffected) {
          console.log('AppUser Deleted.');
          this.hideLoader();
        }
        else {
          console.log('No AppUser Deleted.');
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  }

 public isProductExist(id: any) {
    let a = false;
    if(this.Products != undefined && this.Products != null){
      for(var i=0;i<this.Products.length;i++){
        if(this.Products == id){
            a = true;
        }
      }
    }
    return a;
    // let isExists = _.find(this.Products, { id : idd } );
    // return ( isExists ? true : false );
  }

  public insertProduct(pro: any,deliveryId: any,status: any) {
    console.log(pro);
    console.log(deliveryId);
    this.db.getDeliveryStatus(deliveryId)
      .then(data => {
          console.log(data);
          let stts = data;
          this.db.updateAppUser(pro,deliveryId,status,stts)
          .then(data => {
          for(var i=0;i<this.AppUsers.length;i++){
            if(this.AppUsers[i].id==deliveryId){
              for(var y=0;y<this.AppUsers[i].delivery_packages.length;y++){
                if(this.AppUsers[i].delivery_packages[y].id==pro.id){
                    this.AppUsers[i].delivery_packages.splice(y, 1);
                    if(this.AppUsers[i].delivery_packages.length == 0){
                      this.db.updateFinalStatus(this.AppUsers[i].id);
                      this.AppUsers.splice(i, 1);
                    }
                }
              }

            }
          }
          this.MsgAlert('Success','Delivery status is updated successfully');
          console.log(data);
          })
          .catch(ex => {
            // console.log(ex);
            this.MsgAlert('Error',ex);
          });
      })
      .catch(ex => {
        // console.log(ex);
        this.MsgAlert('Error',ex);
      })
    
  }

  upload(){
      this.showLoader();
      this.db.getData()
      .then(data => {
        if(data != undefined && data.length >0){
          console.log(data);
          let deliveryData: any=[];
          let statusData: any=[];
          let dataObj: any={};
          let innerObj: any={};
          let newObj: any = [];
          let status: any;
          for(var i=0;i<data.length;i++){
            // deliveryData.push(JSON.parse(data[i].jsondata));
            statusData.push(JSON.parse(data[i].status));
          }



          for(var y=0;y<data.length;y++){
            dataObj = {};
            innerObj.user_id = JSON.parse(data[y].jsondata).customer_id;
            // dataObj[JSON.parse(data[i].jsondata).id] =
            for(var x=0;x<JSON.parse(data[y].jsondata).delivery_packages.length;x++){
              for(var v=0;v<JSON.parse(data[y].status).length;v++){
                  if(JSON.parse(data[y].status)[v].id==JSON.parse(data[y].jsondata).delivery_packages[x].id){
                    status = JSON.parse(data[y].status)[v].status;
                  }
              }
              innerObj[JSON.parse(data[y].jsondata).delivery_packages[x].id] = [];
              newObj.push(JSON.parse(data[y].jsondata).delivery_packages[x].product.id);
              newObj.push(JSON.parse(data[y].jsondata).delivery_packages[x].quantity);
              newObj.push(JSON.parse(data[y].jsondata).delivery_packages[x].total);
              newObj.push(status);
              innerObj[JSON.parse(data[y].jsondata).delivery_packages[x].id]  = newObj;
              newObj = [];
              status = null;
            }
            dataObj = innerObj;
            innerObj = {};
            deliveryData.push(dataObj);

          }

          this.MsgAlert('Success','Deliveries have been uploaded successfully');


          console.log(deliveryData);
           this.userData.upload(deliveryData).then(results=>{
            console.log(results);
            this.deleteAppUser();
            
           /* let resultData : any ={};
             resultData = results;*/
           
          });
       }else{
         this.MsgAlert('Error','No deliveries found!!');
       }
      })
      
  }

  public getAllAppUsers() {
   //let DeliveryList: any = [];
   // let StatusList: any = [];
    //let that = this;
    this.showLoader();
    this.db.getAppUsers()
      .then(data => {
       for(var i=0;i<data.length;i++){
            this.AppUsers.push(JSON.parse(data[i].jsondata));
            if(JSON.parse(data[i].status) != null){
                for(var x=0;x<JSON.parse(data[i].status).length;x++){
                    this.Products.push(JSON.parse(data[i].status)[x].id);
                }
          }
        }
        this.hideLoader();
      })
      .catch(ex => {
        console.log(ex);
      });
  
  }
  username='';
  name='';
items: any = [];
save()
{

this.sqlite.create({
name: 'data.db',
location: 'default'
})
.then((db: SQLiteObject) => {

//data insert section
db.executeSql('CREATE TABLE IF NOT EXISTS usernameList(id INTEGER PRIMARY KEY AUTOINCREMENT,name)', {})
.then(() => alert('Executed SQL'))
.catch(e => console.log(e));

//data insert section
db.executeSql('INSERT INTO usernameList(name) VALUES(?)', [this.username])
.then(() => alert('Executed SQL'))
.catch(e => console.log(e));


//data retrieve section

db.executeSql('select * from usernameList', {}).then((data) => {

alert(JSON.stringify(data));

//alert(data.rows.length);
//alert(data.rows.item(5).name);
if(data.rows.length > 0) {
for(var i = 0; i < data.rows.length; i++) {
//alert(data.rows.item(i).name);
this.items.push({"name": data.rows.item(i).name});
}
}

}, (err) => {
alert('Unable to execute sql: '+JSON.stringify(err));
});
})
.catch(e => alert(JSON.stringify(e)));
alert(this.username);

}
  
doAlert(pro: any,deliveryId: any) {
    let alert = this._alert.create({
      subTitle: "Delivery Status",
      buttons: [
      {
        text: 'Accept',
        handler: () => {
          this.insertProduct(pro,deliveryId,'1');
        }
      },
        {
        text: 'Reject',
        handler: () => {
          this.insertProduct(pro,deliveryId,'2');
        }
      }
      ],
      cssClass: 'custom-alert'
    });
    alert.present();
  }

   showLoader(){
    this.loading = this._loading.create({
      content: 'Please wait...',
    });
    this.loading.present();
  }

  hideLoader(){
    this.loading.dismiss();
  }

  MsgAlert(type: string,message: string) {
    let alert = this._alert.create({
      title: type,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
}
