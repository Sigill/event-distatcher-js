import { measure } from '../../utils/runner.ts';
import { Emitter } from 'strict-event-emitter';

type MyEvents = {
  event1: [string];
  event2: [string, string, string];
  event3: [string, string, string, string, string];
};

/**
 * Adapter for the strict-event-emitter implementation throughput.
 */
export function runStrictEmitterThroughput(count: number, volume: number): number | null {
  try {
    const emitter = new Emitter<MyEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    emitter.on('event1', () => { callCount++; });
    emitter.on('event2', () => { callCount++; });
    emitter.on('event3', () => { callCount++; });

    const payload = 'benchmark';

    let durationMs = 0;
    if (count === 1) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) emitter.emit('event1', payload);
      });
    } else if (count === 3) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) emitter.emit('event2', payload, payload, payload);
      });
    } else if (count === 5) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) emitter.emit('event3', payload, payload, payload, payload, payload);
      });
    }

    return durationMs;
  } catch {
    return null;
  }
}
