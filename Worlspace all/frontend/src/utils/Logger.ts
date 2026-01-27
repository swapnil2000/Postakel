// Frontend Logger utility
export class Logger {
  static info(module: string, action: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${module} - ${action}: ${message}`, data || '');
  }

  static warn(module: string, action: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${module} - ${action}: ${message}`, data || '');
  }

  static error(module: string, action: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${module} - ${action}: ${message}`, data || '');
  }

  static debug(module: string, action: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [DEBUG] ${module} - ${action}: ${message}`, data || '');
  }

  static success(module: string, action: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [SUCCESS] ${module} - ${action}: ${message}`, data || '');
  }
}
