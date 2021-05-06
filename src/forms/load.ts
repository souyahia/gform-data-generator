import fs from 'fs';
import path from 'path';

const FORMS_DIR = path.join(__dirname, '../../../forms/');

export interface UnknownFormWithFileName {
  fileName: string;
  unknownForm: unknown;
}

export function loadForms(): UnknownFormWithFileName[] {
  return fs
    .readdirSync(FORMS_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      return {
        fileName,
        data: fs.readFileSync(path.join(FORMS_DIR, fileName), 'utf8'),
      };
    })
    .map((dataWithFileName) => {
      return {
        fileName: dataWithFileName.fileName,
        unknownForm: JSON.parse(dataWithFileName.data) as unknown,
      };
    });
}
