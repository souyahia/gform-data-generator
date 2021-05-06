import faker from 'faker';
import { AnswerOption, AnswerOptionFixed, AnswerOptionOther, ChoiceQuestion, DateQuestion, Form, FreeTextQuestion, GridLine, GridQuestion, Question, TimeQuestion } from '../forms';
import { formatDate, Time } from '../utils';
import { AnswerdForm, FormAnswer } from './answerdForm';

type SkippableQuestion = FreeTextQuestion | DateQuestion | TimeQuestion | ChoiceQuestion;

interface AnswerOptionInDistrib extends AnswerOption {
  place: number;
}

export function answerForm(form: Form): AnswerdForm {
  faker.locale = form.locale;
  const answeredForm: AnswerdForm = {
    title: form.title,
    questions: getFormQuestions(form),
    answers: [],
    locale: form.locale,
  };
  for (let i = 0; i < form.answerCount; i++) {
    answeredForm.answers.push(generateFormAnswer(form));
  }
  return answeredForm;
}

function getFormQuestions(form: Form): string[] {
  const questionTitles: string[] = [];
  form.questions.forEach((question) => {
    if (question.type === 'MULTIPLE_CHOICE_GRID' || question.type === 'CHECKBOX_GRID') {
      questionTitles.push(...(question as GridQuestion).lines.map((line) => `${question.title} [${line.title}]`));
    } else {
      questionTitles.push(question.title);
    }
  });
  return questionTitles;
}

function generateFormAnswer(form: Form): FormAnswer {
  const answer: FormAnswer = {
    timestamp: randomIntBetween(form.dateMin, form.dateMax),
    values: [],
  };
  form.questions.forEach((question) => {
    const generatedAnswer = generateQuestionAnswer(question);
    if (typeof generatedAnswer === 'string') {
      answer.values.push(generatedAnswer);
    } else {
      answer.values.push(...generatedAnswer);
    }
  });
  return answer;
}

function generateQuestionAnswer(question: Question): string | string[] {
  switch (question.type) {
    case 'CHECKBOX_GRID':
      return generateGridAnswers(question as GridQuestion);
    case 'CHECKBOXES':
      return generateCheckboxAnswer(question as ChoiceQuestion);
    case 'DATE':
      return generateDateAnswer(question as DateQuestion);
    case 'FREE_TEXT':
      return generateFreeTextAnswer(question as FreeTextQuestion);
    case 'MULTIPLE_CHOICE':
      return generateMultipleChoiceAnswer(question as ChoiceQuestion);
    case 'MULTIPLE_CHOICE_GRID':
      return generateGridAnswers(question as GridQuestion);
    case 'TIME':
      return generateTimeAnswer(question as TimeQuestion);
    default:
      return '';
  }
}

function generateFreeTextAnswer(question: FreeTextQuestion): string {
  return isQuestionSkipped(question) ? '' : faker.fake(question.answerModel);
}

function generateDateAnswer(question: DateQuestion): string {
  if (isQuestionSkipped(question)) {
    return '';
  }
  const selectedDate = new Date(randomIntBetween(question.min, question.max));
  return formatDate(selectedDate, question.withYear, question.withTime);
}

function generateTimeAnswer(question: TimeQuestion): string {
  if (isQuestionSkipped(question)) {
    return '';
  }
  const selectedTotalSeconds = randomIntBetween(new Time(question.min).totalSeconds, new Time(question.max).totalSeconds);
  return new Time(selectedTotalSeconds).toString();
}

function generateMultipleChoiceAnswer(question: ChoiceQuestion): string {
  if (isQuestionSkipped(question) || question.answerOptions.length === 0) {
    return '';
  }
  return getAnswerOptionValue(selectAnswerOption(question.answerOptions));
}

function generateCheckboxAnswer(question: ChoiceQuestion): string {
  if (isQuestionSkipped(question) || question.answerOptions.length === 0) {
    return '';
  }
  return question.answerOptions
    .filter((option) => executeProbability(option.probability))
    .map((option) => getAnswerOptionValue(option))
    .join(';');
}

function generateGridAnswers(question: GridQuestion): string[] {
  return question.lines.map((line) => generateGridLineAnswer(question.required, line, question.columns, question.type));
}

function isQuestionSkipped(question: SkippableQuestion): boolean {
  return !question.required && executeProbability(question.noAnswerProbability);
}

function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function executeProbability(probability: number): boolean {
  return Math.random() <= probability;
}

function createAnswerOptionDistrib(answerOptions: AnswerOption[]): AnswerOptionInDistrib[] {
  let totalPlace = 0;
  return answerOptions
    .map((answerOption) => {
      return {
        ...answerOption,
        place: 0,
      };
    })
    .map((option) => {
      totalPlace += option.probability;
      return {
        ...option,
        place: totalPlace,
      };
    });
}

function selectAnswerOption(answerOptions: AnswerOption[]): AnswerOption {
  const random = Math.random();
  return createAnswerOptionDistrib(answerOptions).find((option) => random <= option.place);
}

function selectCheckboxAnswerOption(answerOptions: AnswerOption[]): AnswerOption[] {
  const options = createAnswerOptionDistrib(answerOptions);
  const selectedOptions: AnswerOption[] = [];
  const selected = options.find((option) => Math.random() <= option.place);
  selectedOptions.push(selected);
  options.splice(
    options.findIndex((option) => option.place === selected.place),
    1
  );
  selectedOptions.push(...options.filter((option) => executeProbability(option.probability)));
  return selectedOptions;
}

function getAnswerOptionValue(answerOption: AnswerOption): string {
  return answerOption.type === 'FIXED' ? (answerOption as AnswerOptionFixed).value : faker.fake((answerOption as AnswerOptionOther).answerModel);
}

function generateGridLineAnswer(required: boolean, line: GridLine, columns: string[], type: 'MULTIPLE_CHOICE_GRID' | 'CHECKBOX_GRID'): string {
  if (!required && executeProbability(line.noAnswerProbability)) {
    return '';
  }
  const answerOptions: AnswerOptionFixed[] = line.probabilityGrid.map((weight, index) => {
    return {
      type: 'FIXED',
      value: columns[index],
      probability: weight,
    };
  });
  return type === 'MULTIPLE_CHOICE_GRID'
    ? (selectAnswerOption(answerOptions) as AnswerOptionFixed).value
    : (selectCheckboxAnswerOption(answerOptions) as AnswerOptionFixed[]).map((option) => option.value).join(';');
}
