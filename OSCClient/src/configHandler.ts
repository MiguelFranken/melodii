import fs from 'fs';
import { logger } from './tools';

export default class ConfigHandler {
    private fileName: string = 'occonfig.json'
    private path: string = __dirname + '/' + this.fileName;

    constructor() {

    }

    public existsFile() {
        return fs.existsSync(this.path);
    }

    public loadData(): object {
        let obj = fs.readFileSync(this.path, 'utf8');
        let jsonobj = JSON.parse(obj);
        return jsonobj;
    }

    public storeData(obj: object, callback:any):void {
        logger('store file', {debug:true});
        let json = JSON.stringify(obj, undefined, 2);
        fs.writeFile(this.path, json, 'utf8', (err) => {
            if (err) console.log(err);
            callback();
        });        
    }
}