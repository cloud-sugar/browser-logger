export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface Stream {
  readonly debug: (args?: any[]) => void;
  readonly info: (args?: any[]) => void;
  readonly log: (args?: any[]) => void;
  readonly warn: (args?: any[]) => void;
  readonly error: (args?: any[]) => void;
  readonly group: (label?: string) => void;
  readonly groupEnd: (label?: string) => void;
}

interface Config {
  readonly name?: string;
  readonly level?: Level;
  readonly format?: (message: Message) => any[];
  readonly stream?: Stream;
}

interface Message {
  readonly level: string;
  readonly name: string;
  readonly date: Date;
  readonly content: any[];
}

type Callback = () => void;

/**
 * The default formatting function
 *
 * @param {Date} message.date - The message time
 * @param {Level} message.level - The message level
 * @param {string} message.name - The logger name
 * @param {any[]=} message.content - The message arguments (e.g. text, JSON)
 *
 * @returns An array of arguments that are forwarded to the Logger stream
 */
function format({ date, level, name, content }: Message): any[] {
  const ts = date.toISOString();
  return [`${ts} [${level.toUpperCase()}] ${name}:`, ...content];
}

/**
 * A tiny logger intended for browsers and space-constrained applications
 *
 * @example <caption>Log Levels</caption>
 * const logger = new Logger({name: 'App', level: 'info'});
 * logger.debug('what is this');
 * logger.info('starting app');
 * logger.log('useful information');
 * logger.warn('something might fail');
 * logger.error('not good');
 * logger.fatal('everything is bad');
 *
 * @example <caption>Multiple arguments</caption>
 * const logger = new Logger({name: 'App', level: 'info'});
 * logger.info('response data', data);
 *
 * @example <caption>Message Groups</caption>
 * const logger = new Logger({name: 'App', level: 'info'});
 * logger.group('starting group', () => {
 *   logger.info('here we go');
 *   logger.info('one more time');
 * });
 */
export class Logger {
  private static levels: string[] = ['debug', 'info', 'warn', 'error', 'fatal'];
  private name: Required<Config>['name'];
  private level: Required<Config>['level'];
  private format: Required<Config>['format'];
  private stream: Required<Config>['stream'];

  /**
   * Creates a Logger instance
   *
   * The logger will conditionally output messages based on the config.level
   * value. If the logger's level is less noisy than the message level, no
   * message is output.
   *
   * **Log Levels:**
   * * fatal (least noisy)
   * * error
   * * warn
   * * info
   * * debug (most noisy)
   *
   * @param {string='app'} config.name - The logger name
   * @param {string='warn'} config.level - The log level
   * @param {Function=} config.format - A message formatter function
   * @param {Object=} config.stream - The destination stream (e.g. console)
   */
  constructor(config: Config) {
    this.name = config.name || 'app';
    this.level = config.level || 'warn';
    this.format = config.format || format;
    this.stream = config.stream || console;
  }

  private shouldDisplay(level: string): boolean {
    return Logger.levels.indexOf(level) >= Logger.levels.indexOf(this.level);
  }

  private logMessage(level: Level, ...args: any[]): void {
    if (this.shouldDisplay(level)) {
      const message = {
        date: new Date(),
        level,
        name: this.name,
        content: args,
      };
      const formattedMessage = this.format(message);
      const streamFuncName = level === 'fatal' ? 'error' : level;
      this.stream[streamFuncName](...formattedMessage);
    }
  }

  /**
   * Logs a message if the Logger is 'debug'
   */
  public debug(...args: any[]): void {
    this.logMessage('debug', ...args);
  }

  /**
   * Logs a message if the Logger level is 'info' or lower
   */
  public log(...args: any[]): void {
    this.logMessage('info', ...args);
  }

  /**
   * Logs a message if the Logger level is 'info' or lower
   */
  public info(...args: any[]): void {
    this.logMessage('info', ...args);
  }

  /**
   * Logs a message if the Logger level is 'warn' or lower
   */
  public warn(...args: any[]): void {
    this.logMessage('warn', ...args);
  }

  /**
   * Logs a message if the Logger level is 'error' or lower
   */
  public error(...args: any[]): void {
    this.logMessage('error', ...args);
  }

  /**
   * Logs a message if the Logger level is 'fatal' or lower
   */
  public fatal(...args: any[]): void {
    this.logMessage('fatal', ...args);
  }

  /**
   * Creates a log group
   *
   * @example
   * const logger = new Logger({name: 'App', level: 'info'});
   * logger.group('starting group', () => {
   *   logger.info('here we go');
   *   logger.info('one more time');
   * });
   */
  public group(label: string, callback: Callback): void {
    try {
      this.stream.group(label);
      callback();
    } catch (e) {
      throw e;
    } finally {
      this.stream.groupEnd();
    }
  }
}
