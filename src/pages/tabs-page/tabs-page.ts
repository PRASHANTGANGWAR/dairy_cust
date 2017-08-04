import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DBProvider } from '../../providers/DBProvider';


@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  AppUsers: Array<Object>;
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = SpeakerListPage;
  tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams,private sqlite: SQLite,public db: DBProvider) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
  ionViewDidLoad() {
    this.deleteAppUser();
    //this.insertAppUser();
    this.getAllAppUsers();
  }
  public deleteAppUser() {
    this.db.deleteAppUser(1)
      .then(data => {
        if (data.res.rowsAffected == 1) {
          console.log('AppUser Deleted.');
        }
        else {
          console.log('No AppUser Deleted.');
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  }

  /*public insertAppUser() {
    this.db.insertAppUser()
      .then(data => {
      console.log(data);
      })
      .catch(ex => {
        console.log(ex);
      });
  }*/

  public getAllAppUsers() {
  let DeliveryList: any = [];
    //let that = this;
    this.db.getAppUsers()
      .then(data => {
        for(var i=0;i<data.length;i++){
        DeliveryList.push(JSON.parse(data[i].jsondata));
        }
        this.AppUsers = DeliveryList;
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
  

}
