import fs from 'fs';
import path from 'path';

const FORMS_DIR = path.join(__dirname, '../../../forms/');

export function loadForms(): unknown[] {
  return fs
    .readdirSync(FORMS_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fs.readFileSync(path.join(FORMS_DIR, fileName), 'utf8'))
    .map((strData) => JSON.parse(strData) as unknown);
}
