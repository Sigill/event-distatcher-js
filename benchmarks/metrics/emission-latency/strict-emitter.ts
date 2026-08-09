import { measureAverage } from '../../utils/runner.ts';
import { Emitter } from 'strict-event-emitter';

/**
 * Adapter for the strict-event-emitter implementation.
 */
type MyEvents = {
  event1: [string];
  event2: [string, string, string];
  event3: [string, string, string, string, string];
};

export function runStrictEmitterLatency(count: number): number | null {
  try {
    const emitter = new Emitter<MyEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    emitter.on('event1', () => { callCount++; });
    emitter.on('event2', () => { callCount++; });
    emitter.on('event3', () => { callCount++; });

    const payload = 'benchmark';

    let measureMs = 0;
    if (count === 1) {
      measureMs = measureAverage(() => emitter.emit('event1', payload), 1000);
    } else if (count === 3) {
      measureMs = measureAverage(() => emitter.emit('event2', payload, payload, payload), 1000);
    } else if (count === 5) {
      measureMs = measureAverage(() => emitter.emit('event3', payload, payload, payload, payload, payload), 1000);
    }

    return measureMs;
  } catch {
    return null;
  }
}
