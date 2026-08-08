import { performance } from 'node:perf_hooks';

/**
 * Executes a given task and returns the time taken in milliseconds.
 */
export async function measure<T>(task: () => Promise<T> | T): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await task();
  const end = performance.now();
  return {
    result,
    duration: end - start,
  };
}

/**
 * Executes a given task multiple times and returns the average duration in milliseconds.
 */
export async function measureAverage<T>(task: () => Promise<T> | T, iterations: number = 10): Promise<{ result: T; avgDuration: number }> {
  const results = [];
  for (let i = 0; i < iterations; i++) {
    const { result, duration } = await measure(task);
    results.push(duration);
  }

  const sum = results.reduce((acc, val) => acc + val, 0);
  return {
    result: results[0], // Return the first result as a representative
    avgDuration: sum / iterations,
  };
}
