import { Locale } from './locale';

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

export type QuestionType =
  | 'FREE_TEXT'
  | 'MULTIPLE_CHOICE'
  | 'DATE'
  | 'DATE_TIME'
  | 'TIME'
  | 'DURATION'
  | 'CHECKBOXES'
  | 'MULTIPLE_CHOICE_GRID'
  | 'CHECKBOX_GRID';

export interface FreeTextQuestion extends Question {
  type: 'FREE_TEXT';
  answerModel: string;
  noAnswerProbability?: number;
}

export interface DateTimeQuestion extends Question {
  type: 'DATE' | 'DATE_TIME' | 'DURATION';
  min: number;
  max: number;
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
}

export interface GridQuestion extends Question {
  type: 'MULTIPLE_CHOICE_GRID' | 'CHECKBOX_GRID';
  columns: string[];
  lines: GridLine[];
}

export interface AnswerOption {
  type: AnswerOptionType;
  weight: number;
}

export type AnswerOptionType = 'FIXED' | 'OTHER';

export interface AnswerOptionFixed extends AnswerOption {
  type: 'FIXED';
  value: string;
}

export interface AnswerOptionOther extends AnswerOption {
  type: 'FIXED';
  answerModel: string;
}

export interface GridLine {
  title: string;
  weightGrid: number[];
  noAnswerProbability?: number;
}
