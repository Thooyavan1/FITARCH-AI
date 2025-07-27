// Color codes for console output
const COLORS = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

function getTimestamp(): string {
  return new Date().toISOString();
}

export function logInfo(message: string): void {
  console.log(
    `${COLORS.blue}[INFO] [${getTimestamp()}]${COLORS.reset} ${message}`,
  );
}

export function logWarning(message: string): void {
  console.warn(
    `${COLORS.yellow}[WARNING] [${getTimestamp()}]${COLORS.reset} ${message}`,
  );
}

export function logError(error: unknown, context?: string): void {
  const errorMsg =
    error instanceof Error ? error.stack || error.message : String(error);
  const contextMsg = context ? `Context: ${context} | ` : "";
  console.error(
    `${COLORS.red}[ERROR] [${getTimestamp()}]${COLORS.reset} ${contextMsg}${errorMsg}`,
  );
}
