import { printTable } from '../../utils/reporter.ts';
import { runEventTargetRegistrationOverhead } from './event-target.ts';
import { runDispatcherRegistrationOverhead } from './dispatcher.ts';
import { runTinyTypedEmitterRegistrationOverhead } from './tiny-emitter.ts';

export function runRegistrationOverheadBenchmark() {
  const counts = [1000, 10000];

  const results: Record<string, any>[] = [];

  for (const count of counts) {
    const dispatcherAvg = runDispatcherRegistrationOverhead(count);
    const eventTargetAvg = runEventTargetRegistrationOverhead(count);
    const tinyEmitterAvg = runTinyTypedEmitterRegistrationOverhead(count);

    let dispatcherStr = 'N/A';
    if (dispatcherAvg !== null) {
      dispatcherStr = `${dispatcherAvg.toFixed(4)}ms`;
    }

    let eventTargetStr = 'N/A';
    if (eventTargetAvg !== null) {
      const relative = dispatcherAvg !== null ? Math.round((eventTargetAvg / dispatcherAvg) * 100) : null;
      eventTargetStr = `${eventTargetAvg.toFixed(4)}ms (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    let tinyEmitterStr = 'N/A';
    if (tinyEmitterAvg !== null) {
      const relative = dispatcherAvg !== null ? Math.round((tinyEmitterAvg / dispatcherAvg) * 100) : null;
      tinyEmitterStr = `${tinyEmitterAvg.toFixed(4)}ms (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    const results_row = {
      'Count': count.toString(),
      'Dispatcher Avg': dispatcherStr,
      'EventTarget Avg': eventTargetStr,
      'TinyEmitter Avg': tinyEmitterStr,
    };

    results.push(results_row);
  }

  printTable('Registration Overhead Benchmark', ['Count', 'Dispatcher Avg', 'EventTarget Avg', 'TinyEmitter Avg'], results);
}

if (typeof process === 'object') {
  runRegistrationOverheadBenchmark();
}
