import fs from 'fs';
import { logger, loggerD } from './tools';

export class ConfigHandler {
    private fileName: string = 'occonfig.json';
    private path: string = __dirname + '/' + this.fileName;

    /**
     * checks if the settings json file exists
     */
    public existsFile(): boolean {
        return fs.existsSync(this.path);
    }

    /**
     * reads the settings file and extracts the settings object
     */
    public loadData(): object {
        const obj = fs.readFileSync(this.path, 'utf8');
        const jsonobj = JSON.parse(obj);
        return jsonobj;
    }

    /**
     * writes the settings object to the json file
     * @param obj Object (Settings object)
     * @param callback (Function) executed if the storing was successful
     */
    public storeData(obj: object, callback: any): void {
        loggerD('store file');
        const json = JSON.stringify(obj, undefined, 2);
        fs.writeFile(this.path, json, 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
            callback();
        });
    }
}
