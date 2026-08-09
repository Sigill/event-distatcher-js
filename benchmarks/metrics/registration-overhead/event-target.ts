import { measureAverage } from '../../utils/runner.ts';

/**
 * Adapter for the EventTarget implementation registration overhead.
 */
export function runEventTargetRegistrationOverhead(count: number): number | null {
  try {
    const task = () => {
      const target = new EventTarget();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (target as any).setMaxListeners?.(0);
      for (let i = 0; i < count; i++) {
        target.addEventListener('message', () => {});
      }
    };

    return measureAverage(task, 5);
  } catch {
    return null;
  }
}
