import Ajv from 'ajv';
import faker from 'faker';
import * as FORM_SCHEMA from '../../schemas/form.json';
import { Time } from '../utils/time';
import {
  AnswerOptionOther,
  ChoiceQuestion,
  DateTimeQuestion,
  Form,
  FreeTextQuestion,
  GridQuestion,
  TimeQuestion,
} from './form';

export const ANSWER_MODEL_INTERPOLATION_REGEX = /({{[^}]+}})/gi;

const ajv = new Ajv();
const validate = ajv.compile(FORM_SCHEMA);

export function validateForm(unknownForm: unknown): Form {
  if (!validate(unknownForm)) {
    const message = validate.errors.reduce(
      (acc, error) =>
        `${acc}\n- Path at ${error.instancePath} : ${error.message} (schema path : ${error.schemaPath})`,
      'Error(s) during form validation :'
    );
    throw new Error(message);
  }
  return validateFormWithCustomRules(unknownForm as Form);
}

function validateFormWithCustomRules(form: Form): Form {
  if (form.dateMin > form.dateMax) {
    throw new Error(
      'Error during form validation : The dateMax property should be greater than or equal to its dateMin property.'
    );
  }

  form.questions
    .filter(
      (question) =>
        question.type === 'DATE' || question.type === 'DATE_TIME' || question.type === 'DURATION'
    )
    .map((question) => question as DateTimeQuestion)
    .forEach((question) => {
      if (question.min > question.max) {
        throw new Error(
          'Error during form validation : The max property of a DATE, DATE_TIME or DURATION question should be greater than its min property.'
        );
      }
    });

  form.questions
    .filter((question) => question.type === 'TIME')
    .map((question) => question as TimeQuestion)
    .forEach((question) => {
      if (new Time(question.max).isBefore(new Time(question.min))) {
        throw new Error(
          'Error during form validation : The max property of a TIME question should be greater than its min property.'
        );
      }
    });

  form.questions
    .filter(
      (question) => question.type === 'MULTIPLE_CHOICE_GRID' || question.type === 'CHECKBOX_GRID'
    )
    .map((question) => question as GridQuestion)
    .forEach((question) => {
      if (question.lines.some((line) => line.weightGrid.length !== question.columns.length)) {
        throw new Error(
          'Error during form validation : The weight grid of a line should have the same length as the number of columns of the question.'
        );
      }
    });

  form.questions
    .filter((question) => question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOXES')
    .map((question) => (question as ChoiceQuestion).answerOptions)
    .reduce((acc, value) => acc.concat(value))
    .filter((answerOption) => answerOption.type === 'OTHER')
    .map((answerOption) => answerOption as AnswerOptionOther)
    .forEach((answerOption) => validateAnswerModel(answerOption.answerModel));

  form.questions
    .filter((question) => question.type === 'FREE_TEXT')
    .map((question) => question as FreeTextQuestion)
    .forEach((question) => validateAnswerModel(question.answerModel));

  return form;
}

function validateAnswerModel(answerModel: string): void {
  const matchArray = answerModel.match(ANSWER_MODEL_INTERPOLATION_REGEX);
  matchArray
    .map((interp) => {
      return {
        interp,
        keys: interp
          .substring(2, interp.length - 2)
          .replace(' ', '')
          .split('.'),
      };
    })
    .forEach((interpWithKeys) => {
      let fakerAttribute: unknown = faker;
      interpWithKeys.keys.forEach((key) => {
        fakerAttribute = fakerAttribute[key] as unknown;
        if (fakerAttribute === undefined) {
          throw new Error(`Invalid Faker.js interpolation : ${interpWithKeys.interp}`);
        }
      });
    });
}
