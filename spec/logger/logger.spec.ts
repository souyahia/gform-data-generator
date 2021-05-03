import logger from '../../src/logger';

describe('Project Logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should not throw when logging a message', () => {
    expect(() => {
      logger.info('[TEST] Trying to log something...');
    }).not.toThrow();
  });
});
