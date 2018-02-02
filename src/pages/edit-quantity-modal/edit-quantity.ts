import { Component } from '@angular/core';
import { ViewController,NavController,NavParams,LoadingController,ToastController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'edit-quantity',
  templateUrl: 'edit-quantity.html',
})
export class EditQuantityModal {
  private productInfo:any = {};
  private loading :any;
  constructor(public viewCtrl: ViewController,
              public navCtrl : NavController,
              private uData: UserData,
              private navParm: NavParams,
              private _loading: LoadingController,
              private toastCtrl: ToastController) {
    this.productInfo = this.navParm.get('ProductInfo');
  }
 
  closeModal() {
   this.viewCtrl.dismiss();
  }

  changeQuantity() {
    this.showLoader();
    let updateData = {"Id": this.productInfo.delId,
                      "package":{"delivery":
                                  {"delivery_packages_attributes":
                                    {"0": {"id": this.productInfo.product.id, "quantity":this.productInfo.product.quantity }}
                                  }
                                }
                      };
    this.uData.editTodayDeliveries(updateData).then((data:any)=> {
      this.loading.dismiss();
      this.presentToast(data.notice);
      this.viewCtrl.dismiss();
    })
  }

  decrementBuff() {
    if(this.productInfo.product.quantity > 0 )
    this.productInfo.product.quantity--;
  }

  incrementBuff() {
    this.productInfo.product.quantity++;
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