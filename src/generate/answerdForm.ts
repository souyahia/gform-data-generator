import { Locale } from '../utils';

export interface AnswerdForm {
  title: string;
  questions: string[];
  answers: FormAnswer[];
  locale: Locale;
}

export interface FormAnswer {
  timestamp: number;
  values: string[];
}
