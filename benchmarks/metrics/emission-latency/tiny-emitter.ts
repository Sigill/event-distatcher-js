import { measureAverage } from '../../utils/runner.ts';
import { TypedEmitter } from 'tiny-typed-emitter';

/**
 * For tiny-typed-emitter we map the tuples to function signatures.
 */
type MyEvents = {
  event1: [string];                     // 1 argument
  event2: [string, string, string]; // 3 arguments
  event3: [string, string, string, string, string]; // 5 arguments
};

type MyEmitterEvents = {
  [K in keyof MyEvents]: (...args: MyEvents[K]) => void;
};

/**
 * Adapter for the tiny-typed-emitter implementation.
 */
export function runTinyTypedEmitterLatency(count: number): number | null {
  if (typeof window !== 'undefined' || typeof process === 'undefined' || !process.versions?.node) {
    return null;
  }
  try {
    const emitter = new TypedEmitter<MyEmitterEvents>();
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
