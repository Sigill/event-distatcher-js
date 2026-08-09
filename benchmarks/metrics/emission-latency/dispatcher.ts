import { measureAverage } from '../../utils/runner.ts';
import { EventDispatcher } from '../../../index.ts';
import { createMockPayload } from '../../utils/data-factory.ts';

type MyEvents = {
  event1: [Record<string, any>];                     // 1 argument
  event2: [Record<string, any>, Record<string, any>, Record<string, any>]; // 3 arguments
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>]; // 5 arguments
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
