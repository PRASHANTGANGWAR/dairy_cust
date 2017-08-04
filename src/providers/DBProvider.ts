import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";

const DB_NAME: string = 'DailySheet';
const win: any = window;

@Injectable()
export class DBProvider {
    private _dbPromise: Promise<any>;

    constructor(public platform: Platform) {
        this._dbPromise = new Promise((resolve, reject) => {
            try {
                let _db: any;
                this.platform.ready().then(() => {
                    if (this.platform.is('cordova') && win.sqlitePlugin) {
                        //FOR MOBILE DEVICE
                        _db = win.sqlitePlugin.openDatabase({
                            name: DB_NAME,
                            location: 'default'
                        });
                    } else {
                        //FOR WEBSQL
                        console.warn('Storage: SQLite plugin not installed, falling back to WebSQL. Make sure to install cordova-sqlite-storage in production!');
                        _db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
                    }
                    resolve(_db);
                });
            } catch (err) {
                reject({ err: err });
            }
        });
        this._tryInit();
    }

    // Initialize the DB with our required tables
    _tryInit() {
        this.query(`CREATE TABLE IF NOT EXISTS AppUser (
                         id INTEGER NOT NULL,
                         jsondata TEXT NOT NULL,
                         PRIMARY KEY(id)
                     )`).catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });
    }

    getAppUsers(): Promise<any> {
        return this.query('SELECT * FROM AppUser').then(data => {
            if (data.res.rows.length > 0) {
                console.log('Rows found.');
                if (this.platform.is('cordova') && win.sqlitePlugin) {
                    let result = [];

                    for (let i = 0; i < data.res.rows.length; i++) {
                        var row = data.res.rows.item(i);
                        result.push(row);
                    }

                    return result;
                }
                else {
                    return data.res.rows;
                }
            }
        });
    }

    insertAppUser(data: any): Promise<any> {
        //let id;
        //let jsondata;
        //let i:number;
        //let a:number = 10;
        /*
        console.log(dataa);
        let dataaa :any = {deliveries:[{"name":"vinod","id":1},{"name":"akash","id":3}]};

        var query = "INSERT INTO AppUser (id, jsondata) VALUES ";
                let obj :any = [];
                 let data: any = [];
                 let rowArgs: any = [];
                 dataaa.deliveries.forEach(function (category: any) {
                         rowArgs.push("(?, ?)");
                         obj = [];
                         obj.push(category.id);
                         obj.push(JSON.stringify(category));
                         data.push(obj);
                     });
                 query += rowArgs.join(", ");
                    console.log(query);
                 this.query(query,[data]);
        */
        //return dataa;

        

        for(var i = 0; i<data.deliveries.length;i++){
            this.query("INSERT INTO AppUser (id,jsondata) VALUES (?, ?);",[i, JSON.stringify(data.deliveries[i])]);
        }

        //return this.query('INSERT INTO AppUser (id, jsondata) VALUES (2, "9876543210")', []);

        return new Promise((resolve, reject) => {
        console.log(reject);
        console.log(resolve);
            return resolve;
        });
    }

    updateAppUser(UserId: any): Promise<any> {
        let query = "UPDATE AppUser SET Email=? WHERE UserId=?";
        return this.query(query, ['niravparsana@outlook.com', UserId]);
    }

    deleteAppUser(UserId: any): Promise<any> {
        let query = "DELETE FROM AppUser WHERE UserId=?";
        return this.query(query, [UserId]);
    }

    query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this._dbPromise.then(db => {
                    db.transaction((tx: any) => {
                        tx.executeSql(query, params,
                            (tx: any, res: any) => resolve({ tx: tx, res: res }),
                            (tx: any, err: any) => reject({ tx: tx, err: err }));
                    },
                        (err: any) => reject({ err: err }));
                });
            } catch (err) {
                reject({ err: err });
            }
        });
    }
}