import { Locale } from '../utils';

export interface FormWithFileName {
  fileName: string;
  form: Form;
}

export interface Form {
  title: string;
  locale: Locale;
  dateMin: number;
  dateMax: number;
  answerCount: number;
  questions: Question[];
}

export interface Question {
  title: string;
  type: QuestionType;
  required: boolean;
}

export type QuestionType = 'FREE_TEXT' | 'MULTIPLE_CHOICE' | 'DATE' | 'TIME' | 'CHECKBOXES' | 'MULTIPLE_CHOICE_GRID' | 'CHECKBOX_GRID';

export interface FreeTextQuestion extends Question {
  type: 'FREE_TEXT';
  answerModel: string;
  noAnswerProbability?: number;
}

export interface DateQuestion extends Question {
  type: 'DATE';
  min: number;
  max: number;
  withYear: boolean;
  withTime: boolean;
  noAnswerProbability?: number;
}

export interface TimeQuestion extends Question {
  type: 'TIME';
  min: string;
  max: string;
  noAnswerProbability?: number;
}

export interface ChoiceQuestion extends Question {
  type: 'MULTIPLE_CHOICE' | 'CHECKBOXES';
  answerOptions: AnswerOption[];
  noAnswerProbability?: number;
}

export interface GridQuestion extends Question {
  type: 'MULTIPLE_CHOICE_GRID' | 'CHECKBOX_GRID';
  columns: string[];
  lines: GridLine[];
}

export interface AnswerOption {
  type: AnswerOptionType;
  probability: number;
}

export type AnswerOptionType = 'FIXED' | 'OTHER';

export interface AnswerOptionFixed extends AnswerOption {
  type: 'FIXED';
  value: string;
}

export interface AnswerOptionOther extends AnswerOption {
  type: 'OTHER';
  answerModel: string;
}

export interface GridLine {
  title: string;
  probabilityGrid: number[];
  noAnswerProbability?: number;
}
