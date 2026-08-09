import { measureAverage } from '../../utils/runner.ts';
import { Emitter } from 'strict-event-emitter';

type MyEvents = {
  message: [];
};

/**
 * Adapter for the strict-event-emitter implementation registration overhead.
 */
export function runStrictEmitterRegistrationOverhead(count: number): number | null {
  try {
    const task = () => {
      const emitter = new Emitter<MyEvents>();

      emitter.setMaxListeners(0);
      for (let i = 0; i < count; i++) {
        emitter.on('message', () => {});
      }
    };

    return measureAverage(task, 5);
  } catch {
    return null;
  }
}
