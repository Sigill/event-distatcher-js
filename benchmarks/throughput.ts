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
 * Adapter for the EventTarget implementation.
 */
function runEventTargetThroughput(count: number, volume: number): number | null {
  try {
    const target = new EventTarget();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const eventTargetDuration = runEventTargetThroughput(count, volume);
      const dispatcherDuration = runDispatcherThroughput(count, volume);

      const eventTargetEps = eventTargetDuration !== null ? (volume / eventTargetDuration) * 1000 : null;
      const dispatcherEps = dispatcherDuration !== null ? (volume / dispatcherDuration) * 1000 : null;

      let dispatcherRefEps: number | null = null;
      if (dispatcherDuration !== null) {
        dispatcherRefEps = (volume / dispatcherDuration) * 1000;
      }

      let dispatcherStr = 'N/A';
      if (dispatcherEps !== null) {
        dispatcherStr = dispatcherEps.toFixed(0);
      }

      let eventTargetStr = 'N/A';
      if (eventTargetEps !== null) {
        const relative = dispatcherRefEps !== null ? Math.round((eventTargetEps / dispatcherRefEps) * 100) : null;
        eventTargetStr = `${eventTargetEps.toFixed(0)} (${relative !== null ? relative + '%' : 'N/A'})`;
      }

      const results_row = {
        'Args': count.toString(),
        'Volume': volume.toString(),
        'Dispatcher EPS': dispatcherStr,
        'EventTarget EPS': eventTargetStr,
      };

      results.push(results_row);
    }
  }

  printTable('Throughput Benchmark', ['Args', 'Volume', 'Dispatcher EPS', 'EventTarget EPS'], results);
}

export { runThroughputBenchmark };

if (typeof process === 'object') {
  runThroughputBenchmark();
}
