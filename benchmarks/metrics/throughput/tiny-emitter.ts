import { measure } from '../../utils/runner.ts';
import { createMockPayload } from '../../utils/data-factory.ts';
import { TypedEmitter } from 'tiny-typed-emitter';

/**
 * For tiny-typed-emitter we map the tuples to function signatures.
 */
type MyEvents = {
  event1: [Record<string, any>];
  event2: [Record<string, any>, Record<string, any>, Record<string, any>];
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>];
};

type MyEmitterEvents = {
  [K in keyof MyEvents]: (args: MyEvents[K]) => void;
};

/**
 * Adapter for the tiny-typed-emitter implementation.
 */
export function runTinyTypedEmitterThroughput(count: number, volume: number): number | null {
  try {
    const emitter = new TypedEmitter<MyEmitterEvents>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let callCount = 0;
    emitter.on('event1', () => { callCount++; });
    emitter.on('event2', () => { callCount++; });
    emitter.on('event3', () => { callCount++; });

    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    let durationMs = 0;
    if (count === 1) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) emitter.emit('event1', args[0]);
      });
    } else if (count === 3) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) emitter.emit('event2', ...args);
      });
    } else if (count === 5) {
      durationMs = measure(() => {
        for (let i = 0; i < volume; i++) emitter.emit('event3', ...args);
      });
    }

    return durationMs;
  } catch {
    return null;
  }
}
