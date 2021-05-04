import { loadForms } from './forms/load';
import { validateForm } from './forms/validate';
import { logger } from './logger';

try {
  const forms = loadForms().map((form) => validateForm(form));
  logger.info('Successfully loaded & validated %d forms.', forms.length);
} catch (err) {
  logger.error(err);
  process.exit(1);
}
