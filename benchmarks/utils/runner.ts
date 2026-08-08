/**
 * Executes a given task and returns the time taken in milliseconds.
 */
export function measure(task: () => void): number {
  const start = performance.now();
  task();
  const end = performance.now();
  return end - start;
}

/**
 * Executes a given task multiple times and returns the average duration in milliseconds.
 */
export function measureAverage(task: () => void, iterations: number = 10): number {
  const results = [];
  for (let i = 0; i < iterations; i++) {
    const duration = measure(task);
    results.push(duration);
  }

  const sum = results.reduce((acc, val) => acc + val, 0);
  return sum / iterations;
}
