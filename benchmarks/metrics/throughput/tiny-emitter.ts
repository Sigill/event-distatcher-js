import { measure } from '../../utils/runner.ts';
import { TypedEmitter } from 'tiny-typed-emitter';

/**
 * For tiny-typed-emitter we map the tuples to function signatures.
 */
type MyEvents = {
  event1: [string];
  event2: [string, string, string];
  event3: [string, string, string, string, string];
};

type MyEmitterEvents = {
  [K in keyof MyEvents]: (...args: MyEvents[K]) => void;
};

/**
 * Adapter for the tiny-typed-emitter implementation.
 */
export function runTinyTypedEmitterThroughput(count: number, volume: number): number | null {
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
