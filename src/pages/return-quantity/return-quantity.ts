import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { LastDeliveryPage } from '../../pages/LastDelivery/lastDelivery';

/**
 * Generated class for the ReturnQuantityPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-return-quantity',
  templateUrl: 'return-quantity.html',
})
export class ReturnQuantityPage {
		private mainNumber_cow = 0;
		private mainNumber_buffalo = 0;
		private mainNumber_toned = 0;
		public product:any;
		public sum:any;
		public amount_to_be_paid:any;
		public id:any;


  constructor( private view: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReturnQuantityPage');
      	this.amount_to_be_paid = this.navParams.get('data');
      	      	this.id = this.navParams.get('customerid');
  }


		incrementMain(product:any)
		{
			if(product=="buffalo")
			{
				this.mainNumber_buffalo=this.mainNumber_buffalo+1;	
			}

			if(product=="cow")
			{
				this.mainNumber_cow=this.mainNumber_cow+1;
			}
			if(product=="toned")
			{
				this.mainNumber_toned=this.mainNumber_toned+1;

			}
			this.sum=this.sum+this.mainNumber_buffalo+this.mainNumber_cow+this.mainNumber_toned;
		}

		decrementMain(product:any)
		{
			if((this.mainNumber_buffalo)>1 || (this.mainNumber_cow) >1 || (this.mainNumber_toned)  >1)
			{
				if(product=="buffalo")
			{
				this.mainNumber_buffalo=this.mainNumber_buffalo-1;	
			}

			if(product=="cow")
			{
				this.mainNumber_cow=this.mainNumber_cow-1;
			}
			if(product=="toned")
			{
				this.mainNumber_toned=this.mainNumber_toned-1;

			}
		}
		this.sum=this.sum+this.mainNumber_buffalo+this.mainNumber_cow+this.mainNumber_toned;

		}

		closeModal(){
	  	this.view.dismiss(null);
	}

	proceed()
	{
		this.navCtrl.push(LastDeliveryPage, {
    sum: 'sum', customerid:this.id
		});
	}
}
