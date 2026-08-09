import { measureAverage } from '../../utils/runner.ts';
import { EventDispatcher } from '../../../index.ts';

type MyEvents = {
  event1: (a: string) => void; // 1 argument
  event2: (a: string, b: string, c: string) => void; // 3 arguments
  event3: (a: string, b: string, c: string, d: string, e: string) => void; // 5 arguments
};

/**
 * Adapter for the Typed EventDispatcher implementation.
 */
export function runDispatcherLatency(count: number): number | null {
  try {
    const dispatcher = new EventDispatcher<MyEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    dispatcher.addEventListener('event1', () => { callCount++; });
    dispatcher.addEventListener('event2', () => { callCount++; });
    dispatcher.addEventListener('event3', () => { callCount++; });

    const payload = 'benchmark';

    let measureMs = 0;
    if (count === 1) {
      measureMs = measureAverage(() => dispatcher.dispatchEvent('event1', payload), 1000);
    } else if (count === 3) {
      measureMs = measureAverage(() => dispatcher.dispatchEvent('event2', payload, payload, payload), 1000);
    } else if (count === 5) {
      measureMs = measureAverage(() => dispatcher.dispatchEvent('event3', payload, payload, payload, payload, payload), 1000);
    }

    return measureMs;
  } catch {
    return null;
  }
}
