import { measureAverage } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';
import { printTable } from './utils/reporter.ts';

/**
 * Adapter for the native EventTarget implementation registration overhead.
 */
function runNativeRegistrationOverhead(count: number): number | null {
  try {
    const task = () => {
      const target = new EventTarget();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      target.setMaxListeners?.(0);
      for (let i = 0; i < count; i++) {
        target.addEventListener('message', () => {});
      }
    };

    return measureAverage(task, 5);
  } catch {
    return null;
  }
}

/**
 * Adapter for the Typed EventDispatcher implementation registration overhead.
 */
function runDispatcherRegistrationOverhead(count: number): number | null {
  try {
    const task = () => {
      const dispatcher = new EventDispatcher<{ message: [string] }>();
      for (let i = 0; i < count; i++) {
        dispatcher.addEventListener('message', () => {});
      }
    };

    return measureAverage(task, 5);
  } catch {
    return null;
  }
}

function runRegistrationBenchmark() {
  const counts = [1000, 10000];

  const results: Record<string, any>[] = [];

  for (const count of counts) {
    const dispatcherAvg = runDispatcherRegistrationOverhead(count);
    const nativeAvg = runNativeRegistrationOverhead(count);

    let dispatcherStr = 'N/A';
    if (dispatcherAvg !== null) {
      dispatcherStr = `${dispatcherAvg.toFixed(4)}ms`;
    }

    let nativeStr = 'N/A';
    if (nativeAvg !== null) {
      const relative = dispatcherAvg !== null ? Math.round((nativeAvg / dispatcherAvg) * 100) : null;
      nativeStr = `${nativeAvg.toFixed(4)}ms (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    const results_row = {
      'Count': count.toString(),
      'Dispatcher Avg': dispatcherStr,
      'Native Avg': nativeStr,
    };

    results.push(results_row);
  }

  printTable('Registration Overhead Benchmark', ['Count', 'Dispatcher Avg', 'Native Avg'], results);
}

runRegistrationBenchmark();
