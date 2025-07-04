class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };
    this.logs.push(logEntry);
    console.log(`[${logEntry.timestamp}] ${level}: ${message}`, metadata);
  }

  info(message, metadata = {}) {
    this.log('INFO', message, metadata);
  }

  error(message, metadata = {}) {
    this.log('ERROR', message, metadata);
  }

  warn(message, metadata = {}) {
    this.log('WARN', message, metadata);
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();