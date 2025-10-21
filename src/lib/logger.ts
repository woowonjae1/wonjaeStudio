type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

/**
 * 简单的日志系统
 */
export class Logger {
  private static isDevelopment = process.env.NODE_ENV === "development";
  private static logLevel: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) || "info";

  private static levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private static shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.logLevel];
  }

  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const context = entry.context ? ` | ${JSON.stringify(entry.context)}` : "";
    const error = entry.error ? ` | Error: ${entry.error.message}` : "";
    return `${prefix} ${entry.message}${context}${error}`;
  }

  static debug(message: string, context?: Record<string, any>) {
    if (!this.shouldLog("debug")) return;

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: "debug",
      message,
      context,
    };

    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry));
    }
  }

  static info(message: string, context?: Record<string, any>) {
    if (!this.shouldLog("info")) return;

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: "info",
      message,
      context,
    };

    console.log(this.formatMessage(entry));
  }

  static warn(message: string, context?: Record<string, any>) {
    if (!this.shouldLog("warn")) return;

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: "warn",
      message,
      context,
    };

    console.warn(this.formatMessage(entry));
  }

  static error(message: string, error?: Error, context?: Record<string, any>) {
    if (!this.shouldLog("error")) return;

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level: "error",
      message,
      context,
      error,
    };

    console.error(this.formatMessage(entry));

    // 在生产环境中，可以将错误发送到错误追踪服务
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      // TODO: 集成 Sentry 或其他错误追踪服务
    }
  }
}

/**
 * API 请求日志中间件
 */
export function logApiRequest(method: string, path: string, userId?: string) {
  Logger.info(`${method} ${path}`, {
    userId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * API 响应日志
 */
export function logApiResponse(
  method: string,
  path: string,
  status: number,
  duration: number
) {
  Logger.info(`${method} ${path} - ${status}`, {
    duration: `${duration}ms`,
  });
}
