import { printTable } from '../../utils/reporter.ts';
import { runEventTargetThroughput } from './event-target.ts';
import { runDispatcherThroughput } from './dispatcher.ts';
import { runTinyTypedEmitterThroughput } from './tiny-emitter.ts';
import { runStrictEmitterThroughput } from './strict-emitter.ts';

export function runThroughputBenchmark() {
  const argCounts = [1, 3, 5];
  const volumes = [10_000, 50_000, 100_000];

  const results: Record<string, any>[] = [];

  for (const count of argCounts) {
    for (const volume of volumes) {
      const dispatcherDuration = runDispatcherThroughput(count, volume);
      const eventTargetDuration = runEventTargetThroughput(count, volume);
      const tinyEmitterDuration = runTinyTypedEmitterThroughput(count, volume);
      const strictEmitterDuration = runStrictEmitterThroughput(count, volume);

      const dispatcherEps = dispatcherDuration !== null ? (volume / dispatcherDuration) * 1000 : null;
      const eventTargetEps = eventTargetDuration !== null ? (volume / eventTargetDuration) * 1000 : null;
      const tinyEmitterEps = tinyEmitterDuration !== null ? (volume / tinyEmitterDuration) * 1000 : null;
      const strictEmitterEps = strictEmitterDuration !== null ? (volume / strictEmitterDuration) * 1000 : null;

      let dispatcherRefEps: number | null = null;
      if (dispatcherDuration !== null) {
        dispatcherRefEps = (volume / dispatcherDuration) * 1000;
      }

      let dispatcherStr = 'N/A';
      if (dispatcherEps !== null) {
        dispatcherStr = dispatcherEps.toFixed(0);
      }

      let eventTargetStr = 'N/A';
      if (eventTargetEps !== null) {
        const relativeToDispatcher = dispatcherRefEps !== null ? Math.round((eventTargetEps / dispatcherRefEps) * 100) : null;
        eventTargetStr = `${eventTargetEps.toFixed(0)} (${relativeToDispatcher !== null ? relativeToDispatcher + '%' : 'N/A'})`;
      }

      let tinyEmitterStr = 'N/A';
      if (tinyEmitterEps !== null) {
        const relativeToDispatcher = dispatcherRefEps !== null ? Math.round((tinyEmitterEps / dispatcherRefEps) * 100) : null;
        tinyEmitterStr = `${tinyEmitterEps.toFixed(0)} (${relativeToDispatcher !== null ? relativeToDispatcher + '%' : 'N/A'})`;
      }

      let strictEmitterStr = 'N/A';
      if (strictEmitterEps !== null) {
        const relativeToDispatcher = dispatcherRefEps !== null ? Math.round((strictEmitterEps / dispatcherRefEps) * 100) : null;
        strictEmitterStr = `${strictEmitterEps.toFixed(0)} (${relativeToDispatcher !== null ? relativeToDispatcher + '%' : 'N/A'})`;
      }

      const results_row = {
        'Args': count.toString(),
        'Volume': volume.toString(),
        'Dispatcher EPS': dispatcherStr,
        'EventTarget EPS': eventTargetStr,
        'TinyEmitter EPS': tinyEmitterStr,
        'StrictEmitter EPS': strictEmitterStr,
      };

      results.push(results_row);
    }
  }

  printTable('Throughput Benchmark', ['Args', 'Volume', 'Dispatcher EPS', 'EventTarget EPS', 'TinyEmitter EPS', 'StrictEmitter EPS'], results);
}

if (typeof process === 'object') {
  runThroughputBenchmark();
}
