import { measure } from '../../utils/runner.ts';

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

    const payload = 'benchmark';

    let durationMs = 0;
    if (count === 1) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) target.dispatchEvent(new CustomEvent('event1', { detail: payload }));
      });
    } else if (count === 3) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) target.dispatchEvent(new CustomEvent('event2', { detail: [payload, payload, payload] }));
      });
    } else if (count === 5) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) target.dispatchEvent(new CustomEvent('event3', { detail: [payload, payload, payload, payload, payload] }));
      });
    }

    return durationMs;
  } catch {
    return null;
  }
}
