import { measureAverage } from '../../utils/runner.ts';
import { EventDispatcher } from '../../../index.ts';

type MyEvents = {
  message: [string];
};

/**
 * Adapter for the Typed EventDispatcher implementation registration overhead.
 */
export function runDispatcherRegistrationOverhead(count: number): number | null {
  try {
    const task = () => {
      const dispatcher = new EventDispatcher<MyEvents>();
      for (let i = 0; i < count; i++) {
        dispatcher.addEventListener('message', () => {});
      }
    };

    return measureAverage(task, 5);
  } catch {
    return null;
  }
}
