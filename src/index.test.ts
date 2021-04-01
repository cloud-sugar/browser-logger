import { Level, Logger } from './index';

describe('Logger', () => {
  describe('should conditionally write based on the logger and message level', () => {
    let stream = {
      debug: jest.fn(),
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      group: jest.fn(),
      groupEnd: jest.fn(),
    };

    const levelToStreamFunc: Record<string, Level> = {
      log: 'info',
      fatal: 'error',
    };

    it.each`
      loggerLevel | messageLevel | expected
      ${'debug'}  | ${'debug'}   | ${true}
      ${'debug'}  | ${'info'}    | ${true}
      ${'debug'}  | ${'warn'}    | ${true}
      ${'debug'}  | ${'error'}   | ${true}
      ${'debug'}  | ${'fatal'}   | ${true}
      ${'info'}   | ${'debug'}   | ${false}
      ${'info'}   | ${'info'}    | ${true}
      ${'info'}   | ${'warn'}    | ${true}
      ${'info'}   | ${'error'}   | ${true}
      ${'info'}   | ${'fatal'}   | ${true}
      ${'warn'}   | ${'debug'}   | ${false}
      ${'warn'}   | ${'info'}    | ${false}
      ${'warn'}   | ${'warn'}    | ${true}
      ${'warn'}   | ${'error'}   | ${true}
      ${'warn'}   | ${'fatal'}   | ${true}
      ${'error'}  | ${'debug'}   | ${false}
      ${'error'}  | ${'info'}    | ${false}
      ${'error'}  | ${'warn'}    | ${false}
      ${'error'}  | ${'error'}   | ${true}
      ${'error'}  | ${'fatal'}   | ${true}
      ${'fatal'}  | ${'debug'}   | ${false}
      ${'fatal'}  | ${'info'}    | ${false}
      ${'fatal'}  | ${'warn'}    | ${false}
      ${'fatal'}  | ${'error'}   | ${false}
      ${'fatal'}  | ${'fatal'}   | ${true}
    `(
      'should not write when logger level is $loggerLevel and message level is $messageLevel',
      ({ loggerLevel, messageLevel, expected }) => {
        const logger = new Logger({ level: loggerLevel, stream });
        logger[messageLevel as Level]('test');
        const streamFn: Level = levelToStreamFunc[messageLevel]|| messageLevel;
        const actual = stream[streamFn].mock.calls.length > 0;
        expect(actual).toEqual(expected);
      }
    );
  });
});
