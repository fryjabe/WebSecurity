var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    name: 'info-file',
      filename: 'logs/log-info.log',
      level: 'info',
      colorize: true,
  },
  debug: {
    name: 'debug-file',
    filename: 'logs/log-debug.log',
    level: 'debug'
  },
  error: {
    name: 'error-file',
    filename: 'logs/log-error.log',
    level: 'error',
    colorize: true,
},
  warn: {name: 'warn-file',
  filename: 'logs/log-warn.log',
  level: 'warn'
}
};

// instantiate a new Winston Logger with the settings defined above
let logger = winston.createLogger({
    transports: [
      new (winston.transports.File)(options.debug),
      new (winston.transports.File)(options.file),
      new (winston.transports.File)(options.warn),
      new (winston.transports.File)(options.error),

    ],
    exitOnError: false, // do not exit on handled exceptions
  });

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
