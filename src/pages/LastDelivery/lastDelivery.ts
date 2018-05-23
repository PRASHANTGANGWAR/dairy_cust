import { Component } from '@angular/core';
import { NavParams, AlertController, LoadingController ,ModalController,Modal,NavController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';
 import { ReturnQuantityPage } from '../../pages/return-quantity/return-quantity';


@Component({
  selector: 'last-delivery',
  templateUrl: 'lastDelivery.html'
})

export class LastDeliveryPage {
  private loading :any;
  Deliveries: any=[];
  Customer: any={};
  id: number;
  public today:any;
  public date:any;
  public total:any;
  public sum:any;


  constructor(
    private navParams: NavParams,
    public userData: UserData,
    private _alert: AlertController,
    private _loading: LoadingController,
        public modalCtrl: ModalController,
    public navCtrl: NavController

    ) {
        this.id = this.navParams.get('customerid');
        this.delivered();
                this.sum = this.navParams.get('sum');

console.log("test"+this.sum);
      // this.delivered();
    }

  delivered() {
      this.showLoader();
      console.log(this.id);
      this.userData.lastDeliveries(this.id).then(results=>{
        this.hideLoader();
           let result : any ={};
          result = results;
          if(result.customer){
            this.Customer = result.customer;
            this.Deliveries = result.customer.deliveries;
            if(result.customer.deliveries.length==0){
              this.doAlert('Status','No past deliveries');
            }
          }else{
             this.doAlert('Status','Please try again');
          }
          
      });
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

  doAlert(type: string,message: string) {
    console.log(type);
    let alert = this._alert.create({
      subTitle: message,
      buttons: ['ok'],
       cssClass: 'my-alert'
    });
    alert.present();
  }


returnOrder()
{
      let order_data:number = this.Deliveries.balance;
      const chekoutModal:Modal = this.modalCtrl.create(ReturnQuantityPage,{data: order_data,customerid: this.id});
      chekoutModal.present();

      chekoutModal.onDidDismiss((data)=>{
        if(data){
         this.navCtrl.setRoot(LastDeliveryPage,{customerid: this.id});
        }
    });
}

editOrder(total:any)
{
    let alert = this._alert.create({
      title: 'Return Qunatity?',
      message: total,
     
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'CONFIRM',
          handler: () => {

            if(true){
              this.calculate();
            } 
          }
        }
        ,
        {
          text: 'CONFIRM',

          handler: () => {

            if(true){
              this.calculate();
            } 
          }
        }
      ]
    });
    alert.present();
  }

calculate()
{

}
/*  getdate(delivery_date:any)
  {
    console.log(delivery_date);
      var isDelivered=false;
      this.today = new Date();
      var month = this.today.getMonth() + 1;
      var dt =  this.today.getDate();
      var zero_month= '';
      var zero_date= '';
      if(month <10){
      zero_month= '0';
       }
      if (dt<10) {
       zero_date ='0';
      }
       this.date=this.today.getFullYear() + '-' + zero_month + (this.today.getMonth() + 1) + '-' + zero_date+this.today.getDate();
      if (delivery_date >  this.date )
    {  
      isDelivered = true;   
      return isDelivered ;
      }
      else{      {
        isDelivered = false;
        return  isDelivered;
      }
  }
*/
}
