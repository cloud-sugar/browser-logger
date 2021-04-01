# browser-logger

A tiny logger intended for browsers and space-constrained applications.

## Basic Usage

```javascript
import { Logger } from '@cloudsugar/browser-logger';

const logger = new Logger({name: 'App', level: 'info'});

// Log levels
logger.debug('what is this');
logger.info('starting app');
logger.log('useful information');
logger.warn('something might fail');
logger.error('not good');
logger.fatal('everything is bad');

// Multiple arguments
logger.info('response data', data);

// Message groups
const logger = new Logger({name: 'App', level: 'info'});
logger.group('starting group', () => {
  logger.info('here we go');
  logger.info('one more time');
});

```

