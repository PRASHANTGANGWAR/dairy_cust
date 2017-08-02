import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = SpeakerListPage;
  tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams,private sqlite: SQLite) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  username='';
  name='';
items: any = [];
save()
{

debugger;
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
