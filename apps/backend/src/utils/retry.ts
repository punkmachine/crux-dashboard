const DELAYS = [3000, 9000, 18000]; // 3, 9, 18 секунд

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = DELAYS[attempt] || DELAYS[DELAYS.length - 1];
        console.log(
          `Попытка ${attempt + 1} не удалась, повтор через ${delay}мс...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error(`Все ${maxRetries + 1} попыток не удались`);
      }
    }
  }

  throw lastError;
}
