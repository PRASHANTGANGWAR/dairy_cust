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
                         status TEXT,
                         final_status INTEGER,
                         PRIMARY KEY(id)
                     )`).catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });
    }


    getAppUsers(): Promise<any> {
        return this.query('SELECT * FROM AppUser WHERE final_status is NULL or final_status = 0').then(data => {
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

    getData(): Promise<any> {
        return this.query('SELECT * FROM AppUser WHERE final_status = 1').then(data => {
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

    getDeliveryStatus(id: any): Promise<any> {
        return this.query('SELECT status FROM AppUser WHERE id='+id).then(data => {
            if (data.res.rows[0].status == null) {
                console.log('Rows found.');
                if (this.platform.is('cordova') && win.sqlitePlugin) {
                    let result = "null";

                    return result;
                }
                else {
                    return data.res.rows[0].status;
                }
            }else{
                return data.res.rows[0].status;
            }
        });
    }

    insertAppUser(data: any): Promise<any> {
        for(var i = 0; i<data.deliveries.length;i++){
            this.query("INSERT INTO AppUser (id,jsondata) VALUES (?, ?);",[data.deliveries[i].id, JSON.stringify(data.deliveries[i])]);
        }

        return new Promise((resolve, reject) => {
        console.log(reject);
        console.log(resolve);
            return resolve;
        });
    }


    updateAppUser(pro: any,deliveryId: any,status: any,stts: any): Promise<any> {
        console.log(pro);
        console.log(deliveryId);
        console.log(status);
        let ary: any = [];
        let obj: any = {};
        let str: any;
        obj.status = status;
        obj.id = pro.id;
        ary.push(obj);
        if(stts == null){
            str = JSON.stringify(ary);
        }else{
            str = JSON.parse(stts);
            str.push(obj)
            str = JSON.stringify(str);
        }
        console.log(stts);
        console.log(str);
        return this.query('UPDATE AppUser SET status=?,final_status=? WHERE id=?', [str, 0, deliveryId]);
    }

    updateFinalStatus(deliveryid: any): Promise<any> {
        console.log(deliveryid);
        return this.query('UPDATE AppUser SET final_status=? WHERE id=?', [1, deliveryid]);
    }

    deleteAppUser(): Promise<any> {
        // let query = "DELETE FROM AppUser WHERE final_status = 1";
        return this.query("DELETE FROM AppUser WHERE final_status = 1");
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