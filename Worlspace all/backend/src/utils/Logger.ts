import fs from 'fs';
import path from 'path';

type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' | 'SUCCESS';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  action: string;
  message: string;
  data?: any;
  error?: any;
}

export class Logger {
  private static logsDir = path.join(process.cwd(), 'logs');
  private static today = new Date().toISOString().split('T')[0];
  private static logFile = path.join(Logger.logsDir, `${Logger.today}-app.log`);

  static {
    // Ensure logs directory exists
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private static colorize(level: LogLevel, text: string): string {
    const colors: Record<LogLevel, string> = {
      INFO: '\x1b[36m',    // Cyan
      ERROR: '\x1b[31m',   // Red
      WARN: '\x1b[33m',    // Yellow
      DEBUG: '\x1b[35m',   // Magenta
      SUCCESS: '\x1b[32m', // Green
    };
    return `${colors[level]}${text}\x1b[0m`;
  }

  private static formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private static writeToFile(entry: LogEntry): void {
    try {
      const logLine = this.formatLog(entry) + '\n';
      fs.appendFileSync(this.logFile, logLine, 'utf-8');
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  private static log(
    level: LogLevel,
    module: string,
    action: string,
    message: string,
    data?: any,
    error?: any
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      action,
      message,
      ...(data && { data }),
      ...(error && { error: error.message || String(error) }),
    };

    // Console output
    const prefix = this.colorize(level, `[${level}]`);
    const modulePrefix = this.colorize('DEBUG', `[${module}]`);
    const actionPrefix = this.colorize('DEBUG', `[${action}]`);
    console.log(`${prefix} ${modulePrefix} ${actionPrefix} ${message}`, data || '');

    // File output
    this.writeToFile(entry);
  }

  static info(module: string, action: string, message: string, data?: any): void {
    this.log('INFO', module, action, message, data);
  }

  static error(module: string, action: string, message: string, error?: any, data?: any): void {
    this.log('ERROR', module, action, message, data, error);
  }

  static warn(module: string, action: string, message: string, data?: any): void {
    this.log('WARN', module, action, message, data);
  }

  static debug(module: string, action: string, message: string, data?: any): void {
    this.log('DEBUG', module, action, message, data);
  }

  static success(module: string, action: string, message: string, data?: any): void {
    this.log('SUCCESS', module, action, message, data);
  }

  static getLogFile(): string {
    return this.logFile;
  }
}
