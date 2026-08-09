import { measure } from '../../utils/runner.ts';
import { createMockPayload } from '../../utils/data-factory.ts';

/**
 * Adapter for the EventTarget implementation.
 */
export function runEventTargetThroughput(count: number, volume: number): number | null {
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
