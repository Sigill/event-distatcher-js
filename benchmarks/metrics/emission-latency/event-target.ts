import { measureAverage } from '../../utils/runner.ts';
import { createMockPayload } from '../../utils/data-factory.ts';

/**
 * Adapter for the EventTarget implementation.
 */
export function runEventTargetLatency(count: number): number | null {
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
