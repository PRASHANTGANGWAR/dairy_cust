import { Component } from '@angular/core';

// import { ViewController } from 'ionic-angular';

// import { UserData } from '../../providers/user-data';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html'
})

export class ModalPage {
 /* private loading :any;
  Deliveries: any=[];*/

  constructor(
    // public viewCtrl: ViewController
    ) {
      // this.delivered();
    }


  
/*
  delivered() {
      this.showLoader();
      this.userData.deliveredItems().then(results=>{
        this.hideLoader();
           let result : any ={};
          result = results;
          if(result.deliveries.length){
            for(var i=0;i<result.deliveries.length;i++){
              if(result.deliveries[i].delivery_status == 1){
                this.Deliveries = result.deliveries[i].deliveries;
              }
            }           
          } else{
            this.doAlert('Error','Please try again');
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
    let alert = this._alert.create({
      title: type,
      subTitle: message,
      buttons: ['Done','Cancel']
    });
    alert.present();
  }
*/
}
