import { Component } from '@angular/core';
import { UserData } from '../../providers/user-data';
import {Slides} from 'ionic-angular';
import {TextInput} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import { EditQuantityModal } from '../edit-quantity-modal/edit-quantity';
// import { ModalPage } from '../modal/modal';
import { DBProvider } from '../../providers/DBProvider';
import { Events, MenuController, AlertController, LoadingController,ModalController} from 'ionic-angular';
declare var window:any;
//import * as _ from 'underscore';
@Component({
  selector: 'tabs-page-list',
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  public TotalPackets : number = 0;
  public DeliveredPackets : number = 0;
  public hideButton : boolean = false;
  private updateButtonDisableTime:number = 1000*60*3;// disable for 3 minute
  private removeDataFromStorageTime:number = 1000*60*2; // empty local storage time
   @ViewChild('SlideInput') SlideInput: TextInput;
   @ViewChild('mySlider') slider: Slides;
   initialSlide: number;
  queryText = '';
  AppUsers: any=[];
  Products: any=[];
  ProductsQuantity: any=[];
  pendingProductsQuantity:any=[];
  status: any=[];
  totalDeiliveryProducts: any;
  DeiliveredProducts: any;
  private loading :any;

  constructor( public events: Events,
               public menu: MenuController,
               public userData: UserData,
               private _loading: LoadingController,
               public db: DBProvider,
               private _alert: AlertController,
               private modalCtrl: ModalController) {
    this.menu.enable(true, 'loggedInMenu');
    this.totalDeiliveryProducts = JSON.parse(window.localStorage.getItem('totalPackages'));
    this.DeiliveredProducts = JSON.parse(window.localStorage.getItem('totalDelivered'));
    this.checkTime();
  }
  ionViewDidLoad() {
    this.getAllPendings();
  }
  public deleteAppUser() {
    this.db.deleteAppUser()
      .then(data => {
        if (data.res.rowsAffected) {
          var newDate = new Date();
          window.localStorage.setItem('updateTime',JSON.stringify(newDate));
          this.hideButton = true;
          this.events.publish('user:disable');
          this.buttonDisable();
          this.hideLoader();
          this.MsgAlert('Success','Deliveries have been uploaded successfully');
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

  getStyle(name: any){
    if(name == "Desi Buffalo milk") {
      return "#a50be8";
    }
    if(name == "Desi Cow milk") {
      return "#0f8ddb";
    }
  }

  updateSchedule() {
    this.db.getpending()
      .then(data => {
       this.AppUsers = [];
       for(var z=0;z<data.length;z++){
            this.AppUsers.push(JSON.parse(data[z].jsondata));
         }
        for(var i=0;i<this.AppUsers.length;i++){
          if(this.AppUsers[i] && this.AppUsers[i].customer_name ){
              var name = this.AppUsers[i].customer_name.toUpperCase();
              var address = this.AppUsers[i].address.name.toUpperCase();
              var mobile = this.AppUsers[i].address.mobile;
              var city = this.AppUsers[i].address.city.name.toUpperCase();
              var state = this.AppUsers[i].address.state.name.toUpperCase();
              var area = this.AppUsers[i].address.area.name.toUpperCase();
              if((name.indexOf(this.queryText.toUpperCase())>-1)|| (mobile.indexOf(this.queryText)>-1) || (address.indexOf(this.queryText.toUpperCase())>-1) || (city.indexOf(this.queryText.toUpperCase())>-1) || (area.indexOf(this.queryText.toUpperCase())>-1) || (state.indexOf(this.queryText.toUpperCase())>-1)){
         
              } else {
                this.AppUsers.splice(i,1);
                i--;
              }
            }            
          }
          this.slider.slideTo(this.initialSlide,0);
      })    
  }

  checkTime() {
      var updateTime = JSON.parse(window.localStorage.getItem('updateTime'));
      var onetime=JSON.parse(window.localStorage.getItem('loginDetails.one_time_device'));
    if(updateTime){
      var now = new Date();
      var predate = new Date(updateTime);
      if(now.valueOf() > predate.valueOf()){
        var diff = now.valueOf() - predate.valueOf()
        if(onetime){
        if(diff >= this.removeDataFromStorageTime){
          window.localStorage.removeItem('updateTime');
          this.hideButton = false;
          console.log(diff);
          this.events.publish('user:enable');
        }
        else if(diff < this.removeDataFromStorageTime){
          this.events.publish('user:disable');
          this.hideButton = true;
          var newdif = this.removeDataFromStorageTime - diff;
          this.updateTimeout(newdif);
        }
      }else{
       if(diff >= this.updateButtonDisableTime){
          window.localStorage.removeItem('updateTime');
          this.hideButton = false;
          console.log(diff);
          this.events.publish('user:enable');
        }
        else if(diff < this.updateButtonDisableTime){
          this.events.publish('user:disable');
          this.hideButton = true;
          var newdif1 = this.updateButtonDisableTime - diff;
          this.updateTimeout(newdif1);
        }

      }
      }
     
    }
    
        
  }

  updateTimeout(diff: any){
    let that = this;
    setTimeout(function () {
      window.localStorage.removeItem('updateTime');
        that.hideButton = false;
        that.events.publish('user:enable');
    }, diff);
  }

  public insertProduct(pro: any,deliveryId: any,status: any, customerId:number) {
    this.db.getDeliveryStatus(deliveryId)
      .then(data => {
          this.DeiliveredProducts++;
          console.log(data);
          let stts = data;
          this.db.updateAppUser(pro,deliveryId,status,stts)
          .then(data => {
           for(var i=0;i<this.AppUsers.length;i++){
            if(this.AppUsers[i].id==deliveryId){
              for(var y=0;y<this.AppUsers[i].delivery_packages.length;y++){
                if(this.AppUsers[i].delivery_packages[y].id==pro.id){
                    this.AppUsers[i].delivery_packages.splice(y, 1);
                    
                    if(status == 1){
                    this.TotalPackets -= pro.quantity;
                      for(var x=0;x<this.pendingProductsQuantity.length;x++){
                    if(this.pendingProductsQuantity[x].product_name == pro.product.display_name){
                      this.pendingProductsQuantity[x].quantity-=pro.quantity;
                    }
                    }

                  
                    }
                   
                    if(status == 1){
                      this.DeliveredPackets += pro.quantity;
                    }
                    if(this.AppUsers[i].delivery_packages.length == 0){
                      this.db.updateFinalStatus(this.AppUsers[i].id);
                      this.AppUsers.splice(i, 1);
                      if(i!=0){
                        this.slider.slideTo(i,0);
                      }
                      if(!this.AppUsers.length){
                        this.slider.slideTo(0,0);
                        break;
                      }
                      // this.TotalPackets--;
                    }
                }
              }

            }
          }
          window.localStorage.setItem('pendingProductsQuantity',JSON.stringify(this.pendingProductsQuantity));
          this.MsgAlert('Success','Delivery status is updated successfully', customerId);
          console.log(data);
          })
          .catch(ex => {
            console.log(ex);
            // this.MsgAlert('Error',ex);
          });
      })
      .catch(ex => {
        // console.log(ex);
        this.MsgAlert('Error',ex);
      })
    
  }

  buttonDisable() {
    let that = this;
    var onetime=JSON.parse(window.localStorage.getItem('loginDetails.one_time_device'));
    if(onetime){
    setTimeout(function () {
      window.localStorage.removeItem('updateTime');
        that.hideButton = false;
        that.events.publish('user:enable');
    }, this.removeDataFromStorageTime);
    }else{
     setTimeout(function () {
      window.localStorage.removeItem('updateTime');
        that.hideButton = false;
        that.events.publish('user:enable');
    }, this.updateButtonDisableTime);

    }
  }

  upload(){
      window.localStorage.setItem('TotalPackets',JSON.stringify(this.TotalPackets));
      window.localStorage.setItem('DeliveredPackets',JSON.stringify(this.DeliveredPackets));
      window.localStorage.setItem('deliveredOrder',JSON.stringify(this.DeliveredPackets));
       window.localStorage.setItem('pendingProductsQuantity',JSON.stringify(this.pendingProductsQuantity));
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
            statusData.push(JSON.parse(data[i].status));
          }
          for(var y=0;y<data.length;y++){
            // dataObj = {};
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
              newObj.push(parseInt(status));
              innerObj[JSON.parse(data[y].jsondata).delivery_packages[x].id]  = newObj;
              newObj = [];
              status = null;
            }
            dataObj[JSON.parse(data[y].jsondata).id] = innerObj;
            innerObj = {};

          }

          let resultData: any = {};
          
          console.log(deliveryData);
           this.userData.upload(dataObj).then(results=>{
            console.log(results);
            resultData = results;
            if(resultData.status == 200){
              this.deleteAppUser();
            }else{
              this.hideLoader();
              this.MsgAlert('Error','Deliveries was not uploaded, please try again !');
            }
            
          });
       }else{
         this.hideLoader();
         this.MsgAlert('Error','No deliveries found!!');
       }
      })
      
  }
  
  refresh() {
    this.showLoader();
    this.db.deleteTable()
      .then(data => {
        window.localStorage.removeItem('productQuantity');
       console.log(data);
         this.userData.device_deliverie().then(results=>{
          let resultData : any ={};
          let result : any ={};
          let newObj : any ={};
          result = results;
            resultData = results;
            // window.localStorage.removeItem('DeliveredPackets');
            window.localStorage.setItem('productQuantity',JSON.stringify(resultData.product_quantities));
           // window.localStorage.setItem('pendingProductsQuantity',JSON.stringify(resultData.product_quantities));
            this.pendingProductsQuantity = JSON.parse(window.localStorage.getItem('pendingProductsQuantity'));

            
          if(resultData.deliveries){
            newObj.deliveries = [];
            for(var i=0;i<resultData.deliveries.length;i++){
                if(resultData.deliveries[i].delivery_status == "0"){
                    newObj.deliveries.push(resultData.deliveries[i]);
                }
            }
            this.insertAppUser(newObj);
          } else{
            this.MsgAlert('Error','No pending deliveries');
          }
      });
      })
  }

  public insertAppUser(resultData: any) {
    
    this.db.insertAppUser(resultData);
      this.hideLoader();
      this.getAllPendings();
  }


  public getAllPendings() {
    this.TotalPackets = 0;
    this.DeliveredPackets = 0;
    if(JSON.parse(window.localStorage.getItem('deliveredOrder'))){
      this.DeliveredPackets += JSON.parse(window.localStorage.getItem('deliveredOrder'));
    }
    if(window.localStorage.getItem('productQuantity')){
      this.ProductsQuantity = JSON.parse(window.localStorage.getItem('productQuantity'));
      this.pendingProductsQuantity = JSON.parse(window.localStorage.getItem('pendingProductsQuantity'));
        for(var y=0;y<this.pendingProductsQuantity.length;y++){
             this.pendingProductsQuantity[y].quantity =0;
           }
      if(this.ProductsQuantity.length){
        this.initialSlide = 1;
      }else{
        this.initialSlide = 0;
      }
    }else{
      this.initialSlide = 0;
    }
    this.Products = [];
    this.AppUsers = [];
    
    
    this.status = [];
    //this.TotalPackets = 0;
    
    this.showLoader();
    this.db.getAppUsers()
      .then(data => {
        if(data != undefined && data.length > 0){
          for(var i=0;i<data.length;i++){
            if(data[i].final_status == 1){
              for(var t=0;t<JSON.parse(data[i].status).length;t++){
                if(JSON.parse(data[i].status)[t].status == 1){
                    this.DeliveredPackets += JSON.parse(data[i].status)[t].quantity;
                }
              }
            }else{
              this.AppUsers.push(JSON.parse(data[i].jsondata));
              this.status.push(JSON.parse(data[i].status));
              for(var u=0;u<JSON.parse(data[i].jsondata).delivery_packages.length;u++){
                this.TotalPackets += JSON.parse(data[i].jsondata).delivery_packages[u].quantity;
                for(var z=0;z<this.pendingProductsQuantity.length;z++){
                  if(this.pendingProductsQuantity[z].product_name == 
                    JSON.parse(data[i].jsondata).delivery_packages[u].product.display_name){
                    this.pendingProductsQuantity[z].quantity +=JSON.parse(data[i].jsondata).delivery_packages[u].quantity;
                  }
                }
              }
               window.localStorage.setItem('pendingProductsQuantity',JSON.stringify(this.pendingProductsQuantity));
            }
            
            if(JSON.parse(data[i].status) != null && data[i].final_status != 1){
                  for(var x=0;x<JSON.parse(data[i].status).length;x++){
                      this.Products.push(JSON.parse(data[i].status)[x].id);
                      if(JSON.parse(data[i].status).status == 1){
                          this.DeliveredPackets += JSON.parse(data[i].status)[x].quantity;
                      }
                  }
            }
          }
          for(var m=0;m<this.AppUsers.length;m++){
              for(var n=0;n<this.AppUsers[m].delivery_packages.length;n++){
                  for(var o=0;o<this.Products.length;o++){
                      if(this.AppUsers[m].delivery_packages[n].id == this.Products[o]){
                          this.TotalPackets -= this.AppUsers[m].delivery_packages[n].quantity;
                          this.AppUsers[m].delivery_packages.splice(n, 1);
                          if(this.status[m] != undefined){
                            for(var b=0;b<this.status[m].length;b++){
                              if(this.status[m][b].status == 1){
                                  this.DeliveredPackets += this.status[m][b].quantity;
                              }
                            }
                          }
                          
                          
                      }
                  }
                  
              }
          }
          this.hideLoader();
        }else{
          this.hideLoader();
        }
       
        

      })
      .catch(ex => {
        console.log(ex);
      });
  
  }

boxAssign(deliveryId: any, customerId: any) {
  this.showLoader();
  this.userData.boxAssign(deliveryId,customerId).then(results=>{
          console.log(results);
          let resultData : any ={};
           resultData = results;
          if(resultData.status == "created"){
            for(var i=0;i<this.AppUsers.length;i++){
                if(this.AppUsers[i].id == deliveryId && this.AppUsers[i].customer_id == customerId){
                    this.AppUsers[i].box_status = "Assigned";
                }
            }
            this.hideLoader();
            this.MsgAlert('Success',resultData.success);
          } else{
            this.hideLoader();
            this.MsgAlert('Error',"Delivery Box is not assigned");
          }
      });

}

assign(deliveryId: any, customerId: any) {
    let alert = this._alert.create({
      subTitle: "Do you want to assign box?",
      buttons: [
      {
        text: 'Reject',
        role: 'cancel'
        /*handler: () => {
          this.insertProduct(pro,deliveryId,'1');
        }*/
      },
        {
        text: 'Assign',
        handler: () => {
          this.boxAssign(deliveryId, customerId);
        }
      }
      ],
      cssClass: 'Assign-box'
    });
    alert.present();
  }

confirmDelivered(pro: any,deliveryId: any,status: any,customerId:number){
  let alert = this._alert.create({
      title: "Confirm",
      subTitle: "Package will be delivered!",
      buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.insertProduct(pro,deliveryId,status,customerId);
        }
      }
      ],
      cssClass: 'confirm-action-delivered'
    });
    alert.present();
}

confirmRejected(pro: any,deliveryId: any,status: any,customerId:number){
  let alert = this._alert.create({
      title: "Confirm",
      subTitle: "Package will be cancelled!",
      buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.insertProduct(pro,deliveryId,status,customerId);
        }
      }
      ],
      cssClass: 'confirm-action-canceled'
    });
    alert.present();
}
  
doAlert(pro: any,deliveryId: any,customerId:number) {
    let alert = this._alert.create({
      buttons: [
      {
        text: 'Delivered',
        handler: () => {
          this.confirmDelivered(pro,deliveryId,'1',customerId);
        }
      },{
        text: 'Cancelled',
        handler: () => {
          this.confirmRejected(pro,deliveryId,'2',customerId);
        }
      }
      ,{
        text: 'Edit',
        handler: () => {
          let data:any = {
            product:pro,
            delId:deliveryId
          }
          this.editQuantity(data);
          // let modal = this.modalCtrl.create(EditQuantityModal,{ProductInfo:data});
          // modal.present();          
        }
      }
      ],
      cssClass: 'custom-alert-delivery'
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

  MsgAlert(type: string,message: string,customerId ?:number) {
    console.log(type);
    let alert = this._alert.create({
      subTitle: message,
      buttons: [{
        text:'Ok',
        handler: () => {
          if(customerId){
            let modal = this.modalCtrl.create(EditQuantityModal,{id:customerId});
            modal.present();            
          }
        }}],
      cssClass: "msgAlrt"
    });
    alert.present();
  }

  updateNowConfirm(){
      let alert = this._alert.create({
      subTitle: "Do you want to update?",
      buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Update',
        handler: () => {
             this.upload();
        }
      }
      ],
      cssClass: 'logout'
    });
    alert.present();
  }
  refreshConfirm(){
      let alert = this._alert.create({
      subTitle: "Do you want to refresh?",
      buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Refresh',
        handler: () => {
             this.refresh();
        }
      }
      ],
      cssClass: 'logout'
    });
    alert.present();
}

editQuantity(packageData:any) {
      let alert = this._alert.create({
      title: "Enter Quantity",
      inputs: [ 
        {
          type: 'number',
          name: 'Amount',
          placeholder: 'Enter Amount',
          value: 'quantity',
          id: 'abc',
          min:'0'
        },
      ],
      buttons: [
      {
        text: 'SAVE',
        handler: (quantity) => {
          console.log(quantity,packageData);
          this.showLoader();
          let updateData = {"Id": packageData.delId,
                      "package":{"delivery":
                                  {"delivery_packages_attributes":
                                    {"0": {"id": packageData.product.id, "quantity":quantity.Amount }}
                                  }
                                }
                      };
          this.userData.editTodayDeliveries(updateData).then((data:any)=> {
             this.loading.dismiss();
             this.MsgAlert('Success',data.notice);
             for(let productCount=0;productCount < this.AppUsers.length; productCount++){
               if(this.AppUsers[productCount].id == packageData.delId) {
                 for(let packCount = 0;packCount < this.AppUsers[productCount].delivery_packages.length;packCount++) {
                   if(this.AppUsers[productCount].delivery_packages[packCount].id == packageData.product.id){
                     this.AppUsers[productCount].delivery_packages[packCount].quantity = quantity.Amount;  
                   }
                 }
               }
             }
          })
        }
      }
      ],
      cssClass: 'custom-alert'
    });
    alert.present();
}
}
