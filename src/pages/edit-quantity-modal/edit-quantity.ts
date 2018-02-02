import { Component } from '@angular/core';
import { ViewController,NavController,NavParams,LoadingController,ToastController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'edit-quantity',
  templateUrl: 'edit-quantity.html',
})
export class EditQuantityModal {
  private customerId:number;
  private loading :any;
  public DeliveryData:any = {};
  private showData:boolean = false;
  constructor(public viewCtrl: ViewController,
              public navCtrl : NavController,
              private uData: UserData,
              private navParm: NavParams,
              private _loading: LoadingController,
              private toastCtrl: ToastController) {
    let self = this;
    this.customerId = this.navParm.get('id');
    this.uData.getLastDeliveryInfo(this.customerId).then((data:any)=>{
      self.showData = true;
      self.DeliveryData = data;
    })
  }
 
  closeModal() {
   this.viewCtrl.dismiss();
  }

  openEditModal() {
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
 
}