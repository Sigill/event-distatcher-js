import { measure } from '../../utils/runner.ts';
import { EventDispatcher } from '../../../index.ts';

type MyEvents = {
  event1: [string];
  event2: [string, string, string];
  event3: [string, string, string, string, string];
};

/**
 * Adapter for the Typed EventDispatcher implementation.
 */
export function runDispatcherThroughput(count: number, volume: number): number | null {
  try {
    const dispatcher = new EventDispatcher<MyEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    dispatcher.addEventListener('event1', () => { callCount++; });
    dispatcher.addEventListener('event2', () => { callCount++; });
    dispatcher.addEventListener('event3', () => { callCount++; });

    const payload = 'benchmark';

    let durationMs = 0;
    if (count === 1) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event1', payload);
      });
    } else if (count === 3) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event2', payload, payload, payload);
      });
    } else if (count === 5) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event3', payload, payload, payload, payload, payload);
      });
    }

    return durationMs;
  } catch {
    return null;
  }
}
