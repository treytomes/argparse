import {config} from './config';
import {logger} from './logger';

logger.info('Hello world!');

logger.debug({env: config.get('env'), debug: config.get('debug')});
