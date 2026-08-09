import { measureAverage } from '../../utils/runner.ts';
import { createMockPayload } from '../../utils/data-factory.ts';
import { TypedEmitter } from 'tiny-typed-emitter';

type MyEvents = {
  event1: [Record<string, any>];                     // 1 argument
  event2: [Record<string, any>, Record<string, any>, Record<string, any>]; // 3 arguments
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>]; // 5 arguments
};

/**
 * For tiny-typed-emitter we map the tuples to function signatures.
 */
type MyEmitterEvents = {
  [K in keyof MyEvents]: (args: MyEvents[K]) => void;
};

/**
 * Adapter for the tiny-typed-emitter implementation.
 */
export function runTinyTypedEmitterLatency(count: number): number | null {
  try {
    const emitter = new TypedEmitter<MyEmitterEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    emitter.on('event1', () => { callCount++; });
    emitter.on('event2', () => { callCount++; });
    emitter.on('event3', () => { callCount++; });

    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    let measureMs = 0;
    if (count === 1) {
      measureMs = measureAverage(() => emitter.emit('event1', args[0]), 1000);
    } else if (count === 3) {
      measureMs = measureAverage(() => emitter.emit('event2', ...args), 1000);
    } else if (count === 5) {
      measureMs = measureAverage(() => emitter.emit('event3', ...args), 1000);
    }

    return measureMs;
  } catch {
    return null;
  }
}
