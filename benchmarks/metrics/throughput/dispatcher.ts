import { measure } from '../../utils/runner.ts';
import { EventDispatcher } from '../../../index.ts';
import { createMockPayload } from '../../utils/data-factory.ts';

type MyEvents = {
  event1: [Record<string, any>];
  event2: [Record<string, any>, Record<string, any>, Record<string, any>];
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>];
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
