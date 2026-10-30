// Tiện ích vị trí dùng chung cho check-in và SOS.

/** Lỗi khi một tác vụ vượt quá thời hạn cho phép. */
export class TimeoutError extends Error {
  constructor(message = 'Hết thời gian chờ') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/** Chạy promise với thời hạn; quá hạn thì ném TimeoutError. */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

/** Định dạng giờ HH:mm:ss từ timestamp (ms). */
export function formatClockTime(timestamp: number) {
  const date = new Date(timestamp);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
