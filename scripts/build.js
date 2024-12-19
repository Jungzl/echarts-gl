import {globSync} from 'glob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '/../src/');

globSync(ROOT + '**/*.glsl', (err, files) => {
    files.forEach((filePath) => {
        let esslCode = fs.readFileSync(filePath, 'utf-8');
        // TODO Remove comment
        esslCode = esslCode.replace(/\/\/.*\n/g, '');
        esslCode = esslCode.replace(/ +/g, ' ');

        // const dir = path.dirname(filePath);
        // const baseName = path.basename(filePath, '.essl');
        fs.writeFileSync(
          filePath + '.js',
          'export default ' + JSON.stringify(esslCode) + ';\n',
          'utf-8'
        );
    });
});
