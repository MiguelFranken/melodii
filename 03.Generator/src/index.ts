import * as express from 'express';
import * as path from 'path';
import { port } from "./config";

const app = express();
app.use('/', express.static(path.join(__dirname, './static')));
app.listen(port, () => console.log(`Connect to http://localhost:${port} to open the sound generator.`));
