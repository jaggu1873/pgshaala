import * as Sentry from "@sentry/react";

type LogLevel = 'info' | 'warn' | 'error';

export const logger = {
  info: (message: string, extra?: any) => {
    console.log(`[INFO] ${message}`, extra || '');
    Sentry.addBreadcrumb({
      category: 'app',
      message,
      level: 'info',
      data: extra,
    });
  },
  warn: (message: string, extra?: any) => {
    console.warn(`[WARN] ${message}`, extra || '');
    Sentry.addBreadcrumb({
      category: 'app',
      message,
      level: 'warning',
      data: extra,
    });
  },
  error: (message: string, error?: any, extra?: any) => {
    console.error(`[ERROR] ${message}`, error || '', extra || '');
    Sentry.captureException(error || new Error(message), {
      extra: { message, ...extra },
    });
  },
};
