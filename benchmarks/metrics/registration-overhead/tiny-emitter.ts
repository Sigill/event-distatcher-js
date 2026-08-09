import { measureAverage } from '../../utils/runner.ts';
import { createMockPayload } from '../../utils/data-factory.ts';
import { TypedEmitter } from 'tiny-typed-emitter';

type MyEvents = {
  message: [string];
};

/**
 * For tiny-typed-emitter we map the tuples to function signatures.
 */
type MyEmitterEvents = {
  [K in keyof MyEvents]: (args: MyEvents[K]) => void;
};

/**
 * Adapter for the tiny-typed-emitter implementation registration overhead.
 */
export function runTinyTypedEmitterRegistrationOverhead(count: number): number | null {
  try {
    const task = () => {
      const emitter = new TypedEmitter<MyEmitterEvents>();
      emitter.setMaxListeners?.(0);
      for (let i = 0; i < count; i++) {
        emitter.on('message', () => {});
      }
    };

    return measureAverage(task, 5);
  } catch {
    return null;
  }
}
