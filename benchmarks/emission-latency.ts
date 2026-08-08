import { measureAverage } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';
import { createMockPayload } from './data-factory.ts';
import { printTable } from './utils/reporter.ts';

type MyEvents = {
  event1: [Record<string, any>];                     // 1 argument
  event2: [Record<string, any>, Record<string, any>, Record<string, any>]; // 3 arguments
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>]; // 5 arguments
};

/**
 * Adapter for the native EventTarget implementation.
 */
function runNativeLatency(count: number): number | null {
  try {
    const target = new EventTarget();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    target.addEventListener('event1', () => { callCount++; });
    target.addEventListener('event2', () => { callCount++; });
    target.addEventListener('event3', () => { callCount++; });

    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    let measureMs = 0;
    if (count === 1) {
      measureMs = measureAverage(() => target.dispatchEvent(new CustomEvent<Record<string, any>>('event1', { detail: args[0] })), 1000);
    } else if (count === 3) {
      measureMs = measureAverage(() => target.dispatchEvent(new CustomEvent<Record<string, any>>('event2', { detail: args })), 1000);
    } else if (count === 5) {
      measureMs = measureAverage(() => target.dispatchEvent(new CustomEvent<Record<string, any>>('event3', { detail: args })), 1000);
    }

    return measureMs;
  } catch {
    return null;
  }
}

/**
 * Adapter for the Typed EventDispatcher implementation.
 */
function runDispatcherLatency(count: number): number | null {
  try {
    const dispatcher = new EventDispatcher<MyEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    dispatcher.addEventListener('event1', () => { callCount++; });
    dispatcher.addEventListener('event2', () => { callCount++; });
    dispatcher.addEventListener('event3', () => { callCount++; });

    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    let measureMs = 0;
    if (count === 1) {
      measureMs = measureAverage(() => dispatcher.dispatchEvent('event1', ...args), 1000);
    } else if (count === 3) {
      measureMs = measureAverage(() => dispatcher.dispatchEvent('event2', ...args), 1000);
    } else if (count === 5) {
      measureMs = measureAverage(() => dispatcher.dispatchEvent('event3', ...args), 1000);
    }

    return measureMs;
  } catch {
    return null;
  }
}

function runEmissionLatencyBenchmark() {
  const argCounts = [1, 3, 5];

  const results: Record<string, any>[] = [];

  for (const count of argCounts) {
    const dispatcherMs = runDispatcherLatency(count);
    const nativeMs = runNativeLatency(count);

    let dispatcherStr = 'N/A';
    if (dispatcherMs !== null) {
      dispatcherStr = `${(dispatcherMs * 1000).toFixed(3)}us`;
    }

    let nativeStr = 'N/A';
    if (nativeMs !== null) {
      const relative = dispatcherMs !== null ? Math.round((nativeMs / dispatcherMs) * 100) : null;
      nativeStr = `${(nativeMs * 1000).toFixed(3)}us (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    const results_row = {
      'Count': count.toString(),
      'Dispatcher Latency (us)': dispatcherStr,
      'Native Latency (us)': nativeStr,
    };

    results.push(results_row);
  }

  printTable('Emission Latency Benchmark', ['Count', 'Dispatcher Latency (us)', 'Native Latency (us)'], results);
}

export { runEmissionLatencyBenchmark };

if (typeof process === 'object') {
  runEmissionLatencyBenchmark();
}
