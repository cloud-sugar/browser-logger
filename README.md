# browser-logger

A tiny logger intended for browsers and space-constrained applications.

## Features

### Basic Usage
```javascript
import { Logger } from '@cloudsugar/browser-logger';

const logger = new Logger({name: 'App', level: 'info'});

logger.debug('what is this');
logger.info('starting app');
logger.log('useful information');
logger.warn('something might fail');
logger.error('not good');
logger.fatal('everything is bad');
```

### Multiple Arguments
```javascript
logger.info('response data', data);
```

### Message Groups
```javascript
logger.group('starting group', () => {
  logger.info('here we go');
  logger.info('one more time');
});
```

### Silent Mode
```javascript
const logger = new Logger({name: 'App', level: 'silent'});
logger.fatal('this message is ignored');
```


