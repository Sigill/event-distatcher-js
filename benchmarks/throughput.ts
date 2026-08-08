import { measure } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';
import { createMockPayload } from './data-factory.ts';
import { printTable } from './utils/reporter.ts';

type MyEvents = {
  event1: [Record<string, any>];
  event2: [Record<string, any>, Record<string, any>, Record<string, any>];
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>];
};

/**
 * Adapter for the native EventTarget implementation.
 */
function runNativeThroughput(count: number, volume: number): number | null {
  try {
    const target = new EventTarget();
    let callCount = 0;
    target.addEventListener('event1', () => { callCount++; });
    target.addEventListener('event2', () => { callCount++; });
    target.addEventListener('event3', () => { callCount++; });

    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    let durationMs = 0;
    if (count === 1) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) target.dispatchEvent(new CustomEvent<Record<string, any>>('event1', { detail: args[0] }));
      });
    } else if (count === 3) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) target.dispatchEvent(new CustomEvent<Record<string, any>>('event2', { detail: args }));
      });
    } else if (count === 5) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) target.dispatchEvent(new CustomEvent<Record<string, any>>('event3', { detail: args }));
      });
    }

    return durationMs;
  } catch {
    return null;
  }
}

/**
 * Adapter for the Typed EventDispatcher implementation.
 */
function runDispatcherThroughput(count: number, volume: number): number | null {
  try {
    const dispatcher = new EventDispatcher<MyEvents>();
    let callCount = 0;
    dispatcher.addEventListener('event1', () => { callCount++; });
    dispatcher.addEventListener('event2', () => { callCount++; });
    dispatcher.addEventListener('event3', () => { callCount++; });

    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    let durationMs = 0;
    if (count === 1) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event1', ...args);
      });
    } else if (count === 3) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event2', ...args);
      });
    } else if (count === 5) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event3', ...args);
      });
    }

    return durationMs;
  } catch {
    return null;
  }
}

function runThroughputBenchmark() {
  const argCounts = [1, 3, 5];
  const volumes = [10_000, 50_000, 100_000];

  const results: Record<string, any>[] = [];

  for (const count of argCounts) {
    for (const volume of volumes) {
      const nativeDuration = runNativeThroughput(count, volume);
      const dispatcherDuration = runDispatcherThroughput(count, volume);

      const nativeEps = nativeDuration !== null ? (volume / nativeDuration) * 1000 : null;
      const dispatcherEps = dispatcherDuration !== null ? (volume / dispatcherDuration) * 1000 : null;

      let dispatcherRefEps: number | null = null;
      if (dispatcherDuration !== null) {
        dispatcherRefEps = (volume / dispatcherDuration) * 1000;
      }

      let dispatcherStr = 'N/A';
      if (dispatcherEps !== null) {
        dispatcherStr = dispatcherEps.toFixed(0);
      }

      let nativeStr = 'N/A';
      if (nativeEps !== null) {
        const relative = dispatcherRefEps !== null ? Math.round((nativeEps / dispatcherRefEps) * 100) : null;
        nativeStr = `${nativeEps.toFixed(0)} (${relative !== null ? relative + '%' : 'N/A'})`;
      }

      const results_row = {
        'Args': count.toString(),
        'Volume': volume.toString(),
        'Dispatcher EPS': dispatcherStr,
        'Native EPS': nativeStr,
      };

      results.push(results_row);
    }
  }

  printTable('Throughput Benchmark', ['Args', 'Volume', 'Dispatcher EPS', 'Native EPS'], results);
}

runThroughputBenchmark();
