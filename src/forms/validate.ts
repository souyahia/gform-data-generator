import Ajv from 'ajv';
import faker from 'faker';
import * as FORM_SCHEMA from '../../schemas/form.json';
import { Time } from '../utils';
import { AnswerOptionOther, ChoiceQuestion, DateQuestion, Form, FormWithFileName, FreeTextQuestion, GridQuestion, TimeQuestion } from './form';
import { UnknownFormWithFileName } from './load';

export const ANSWER_MODEL_INTERPOLATION_REGEX = /({{[^}]+}})/gi;

const ajv = new Ajv();
const validate = ajv.compile(FORM_SCHEMA);

export function validateForm(unknownFormWithFileName: UnknownFormWithFileName): FormWithFileName {
  if (!validate(unknownFormWithFileName.unknownForm)) {
    const message = validate.errors.reduce(
      (acc, error) => `${acc}\n- Path at ${error.instancePath} : ${error.message} (schema path : ${error.schemaPath})`,
      `Error(s) during form validation of ${unknownFormWithFileName.fileName}:`
    );
    throw new Error(message);
  }
  return validateFormWithCustomRules(unknownFormWithFileName);
}

function validateFormWithCustomRules(unknownFormWithFileName: UnknownFormWithFileName): FormWithFileName {
  const formWithFileName: FormWithFileName = {
    fileName: unknownFormWithFileName.fileName,
    form: unknownFormWithFileName.unknownForm as Form,
  };
  const { form, fileName } = formWithFileName;

  if (form.dateMin > form.dateMax) {
    throw new Error(getErrMsg(fileName, 'The dateMax property should be greater than or equal to its dateMin property.'));
  }

  form.questions
    .filter((question) => question.type === 'DATE')
    .map((question) => question as DateQuestion)
    .forEach((question) => {
      if (question.min > question.max) {
        throw new Error(getErrMsg(fileName, 'The max property of a DATE, DATE_TIME or DURATION question should be greater than its min property.'));
      }
    });

  form.questions
    .filter((question) => question.type === 'TIME')
    .map((question) => question as TimeQuestion)
    .forEach((question) => {
      if (new Time(question.max).totalSeconds < new Time(question.min).totalSeconds) {
        throw new Error(getErrMsg(fileName, 'The max property of a TIME question should be greater than its min property.'));
      }
    });

  form.questions
    .filter((question) => question.type === 'MULTIPLE_CHOICE_GRID' || question.type === 'CHECKBOX_GRID')
    .map((question) => question as GridQuestion)
    .forEach((question) => {
      if (question.lines.some((line) => line.probabilityGrid.length !== question.columns.length)) {
        throw new Error(getErrMsg(fileName, 'The weight grid of a line should have the same length as the number of columns of the question.'));
      }
    });

  form.questions
    .filter((question) => question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOXES')
    .map((question) => (question as ChoiceQuestion).answerOptions)
    .reduce((acc, value) => acc.concat(value), [])
    .filter((answerOption) => answerOption.type === 'OTHER')
    .map((answerOption) => answerOption as AnswerOptionOther)
    .forEach((answerOption) => validateAnswerModel(answerOption.answerModel, formWithFileName.fileName));

  form.questions
    .filter((question) => question.type === 'FREE_TEXT')
    .map((question) => question as FreeTextQuestion)
    .forEach((question) => validateAnswerModel(question.answerModel, formWithFileName.fileName));

  return formWithFileName;
}

function validateAnswerModel(answerModel: string, fileName: string): void {
  const matchArray = answerModel.match(ANSWER_MODEL_INTERPOLATION_REGEX);
  if (!matchArray) {
    throw new Error(`Invalid answerModel in ${fileName} : answerModel must contain at least one Faker.js interpolation key. Used the FIXED answer option type for fixed values.`);
  }
  matchArray.map((interp) => {
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
          throw new Error(`Invalid Faker.js interpolation in ${fileName} : ${interpWithKeys.interp}`);
        }
      });
    });
}

function getErrMsg(fileName: string, message: string): string {
  return `Error during form validation of ${fileName} : ${message}`;
}
