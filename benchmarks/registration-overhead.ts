import { measureAverage } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';
import { printTable } from './utils/reporter.ts';

/**
 * Adapter for the EventTarget implementation registration overhead.
 */
function runEventTargetRegistrationOverhead(count: number): number | null {
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

function runRegistrationOverheadBenchmark() {
  const counts = [1000, 10000];

  const results: Record<string, any>[] = [];

  for (const count of counts) {
    const dispatcherAvg = runDispatcherRegistrationOverhead(count);
    const eventTargetAvg = runEventTargetRegistrationOverhead(count);

    let dispatcherStr = 'N/A';
    if (dispatcherAvg !== null) {
      dispatcherStr = `${dispatcherAvg.toFixed(4)}ms`;
    }

    let eventTargetStr = 'N/A';
    if (eventTargetAvg !== null) {
      const relative = dispatcherAvg !== null ? Math.round((eventTargetAvg / dispatcherAvg) * 100) : null;
      eventTargetStr = `${eventTargetAvg.toFixed(4)}ms (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    const results_row = {
      'Count': count.toString(),
      'Dispatcher Avg': dispatcherStr,
      'EventTarget Avg': eventTargetStr,
    };

    results.push(results_row);
  }

  printTable('Registration Overhead Benchmark', ['Count', 'Dispatcher Avg', 'EventTarget Avg'], results);
}

export { runRegistrationOverheadBenchmark };

if (typeof process === 'object') {
  runRegistrationOverheadBenchmark();
}
