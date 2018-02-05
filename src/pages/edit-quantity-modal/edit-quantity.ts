import { Component } from '@angular/core';
import { ViewController,NavController,NavParams,LoadingController,ToastController,AlertController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'edit-quantity',
  templateUrl: 'edit-quantity.html',
})
export class EditQuantityModal {
  private customerId:number;
  private loading :any;
  public DeliveryData:any = {};
  private user:any = {};
  private showData:boolean = false;
  private showEditData:boolean = false;
  private paymentData:boolean = false;
  private deliveryPackages : any = [];

  constructor(public viewCtrl: ViewController,
              public navCtrl : NavController,
              private uData: UserData,
              private navParm: NavParams,
              private _loading: LoadingController,
              private toastCtrl: ToastController,
              private _alert: AlertController) {
    let self = this;
    this.customerId = this.navParm.get('id');
    this.uData.getLastDeliveryInfo(this.customerId).then((data:any)=>{
      self.showData = true;
      self.DeliveryData = data;
      self.deliveryPackages = data.delivery_packages;
    })
  }
 
  closeModal() {
   this.viewCtrl.dismiss();
  }

  openEditModal() {
    this.showEditData = true;
    this.showData = false;
  }

  

  showLoader() {
    this.loading = this._loading.create({
      content: 'Please wait...',
    });
    this.loading.present();
  }

  presentToast(msg:string) {
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

  setQuantity(value:number, index:number) {
    this.deliveryPackages[index].quantity = value;
  }

  submitQuntity() {
    this.showLoader();
    let editData:any = {};
    editData["delivery"] = {};
    editData.delivery["id"] =  this.DeliveryData.id;
    editData.delivery["delivery_packages_attributes"] = [];
    for(let editPackage = 0; editPackage < this.deliveryPackages.length;editPackage++) {
      editData["delivery"]["delivery_packages_attributes"].push({
        "id": this.deliveryPackages[editPackage].id,
        "quantity": this.DeliveryData.delivery_packages[editPackage].quantity - this.deliveryPackages[editPackage].quantity
      }) 
    }
    this.uData.deleveryRefund(editData).then((data:any)=>{
      this.paymentData = true;
      this.showEditData = false;
      this.user = data;
      // this.presentToast(data.notice);
      this.loading.dismiss();
    })
  }

  paynowBox(id: any,due: any,bill: any,deviceId: any) {
    let alert = this._alert.create({
      title: "Enter Amount to pay",
      inputs: [ 
        {
          type: 'number',
          name: 'Amount',
          placeholder: 'Enter Amount',
          value: 'payment',
          id: 'abc'
        },
      ],
      buttons: [
      {
        text: 'Pay',
        handler: (payment) => {
          
          var min = 100 * Math.floor( due/ 100);
          var max = 100 * Math.ceil( due/ 100);
          if(min != 0){
            if(parseInt(payment.Amount) == min || parseInt(payment.Amount) == max){
               this.confirmPayment(id,due,bill,deviceId,payment);
           }else{
             this.presentToast("Please enter amount "+min+" or "+max+" !");
           }
          }else{
            if(parseInt(payment.Amount) == max){
               this.confirmPayment(id,due,bill,deviceId,payment);
           }else{
             this.presentToast("Please enter amount "+max+" !");
           }
          }
         
          
        }
      }
      ],
      cssClass: 'custom-alert'
    });
    alert.present();
  }

confirmPayment(id: any,due: any,bill: any,deviceId: any,payment: any){
  let alert = this._alert.create({
      title: "Do you want to pay for delivery?",
      buttons: [
      {
        text: 'Confirm',
        handler: () => {
             this.paynow(id,due,bill,deviceId,payment);
        }
      }
      ],
      cssClass: 'confirm-action-payment'
    });
    alert.present();
}

  paynow(id: any,due: any,bill: any,deviceId: any,payment: any) {
       this.showLoader();
       this.uData.paynow(id,due,bill,deviceId,payment.Amount).then(results=>{
          let result : any ={};
          result = results;
          if(result.message && result.message == "Payment Successfully Paid"){
            this.loading.dismiss();
            this.viewCtrl.dismiss();
            this.presentToast(result.message);
          }else{
            this.loading.dismiss();
            this.viewCtrl.dismiss();
            this.presentToast(result.message);
          }
      });
  
    
    // this.navCtrl.push(LastDeliveryPage, {customerid:id});
  }
 
}