import { loadForms, validateForm } from './forms';
import { answerForm, generateCsv } from './generate';
import { logger } from './logger';

try {
  const formWithFileNames = loadForms().map((form) => validateForm(form));
  formWithFileNames.forEach((formWithfFileName) => {
    const answers = answerForm(formWithfFileName.form);
    generateCsv(answers);
  });
  logger.info('Successfully generated answers for %d forms.', formWithFileNames.length);
} catch (err) {
  logger.error(err);
  process.exit(1);
}
