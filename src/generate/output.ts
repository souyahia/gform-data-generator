import fs from 'fs';
import path from 'path';
import { getTimestamp, Locale } from '../utils';
import { AnswerdForm } from './answerdForm';

const OUTPUT_DIR = path.join(__dirname, '../../../output/');

export function generateCsv(answeredForm: AnswerdForm): void {
  const outputFileName = `${answeredForm.title}.csv`;
  fs.writeFileSync(path.join(OUTPUT_DIR, outputFileName), generateCsvData(answeredForm), 'utf8');
}

function generateCsvData(answeredForm: AnswerdForm): string {
  const csvArray: string[][] = [];
  csvArray.push(generateHeaders(answeredForm));
  csvArray.push(...answeredForm.answers.map((question) => [cell(getTimestamp(new Date(question.timestamp))), ...question.values.map((value) => cell(value))]));

  return csvArray.map((lineArray) => lineArray.join(',')).join('\n');
}

function generateHeaders(answeredForm: AnswerdForm): string[] {
  const headers: string[] = [];
  headers.push(getTimestampHeader(answeredForm.locale));
  headers.push(...answeredForm.questions.map((question) => cell(question)));
  return headers;
}

function getTimestampHeader(locale: Locale): string {
  // TODO : Translate with other locales
  switch (locale) {
    case 'fr':
      return '"Horodateur"';
    case 'fr_CA':
      return '"Horodateur"';
    case 'fr_CH':
      return '"Horodateur"';
    default:
      return '"Timestamp"';
  }
}

function cell(str: string): string {
  return `"${str.replace('"', '""')}"`;
}
