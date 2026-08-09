import { printTable } from '../../utils/reporter.ts';
import { runEventTargetLatency } from './event-target.ts';
import { runDispatcherLatency } from './dispatcher.ts';
import { runTinyTypedEmitterLatency } from './tiny-emitter.ts';

export function runEmissionLatencyBenchmark() {
  const argCounts = [1, 3, 5];

  const results: Record<string, any>[] = [];

  for (const count of argCounts) {
    const dispatcherMs = runDispatcherLatency(count);
    const eventTargetMs = runEventTargetLatency(count);
    const tinyEmitterMs = runTinyTypedEmitterLatency(count);

    let dispatcherStr = 'N/A';
    if (dispatcherMs !== null) {
      dispatcherStr = `${(dispatcherMs * 1000).toFixed(3)}us`;
    }

    let eventTargetStr = 'N/A';
    if (eventTargetMs !== null) {
      const relative = dispatcherMs !== null ? Math.round((eventTargetMs / dispatcherMs) * 100) : null;
      eventTargetStr = `${(eventTargetMs * 1000).toFixed(3)}us (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    let tinyEmitterStr = 'N/A';
    if (tinyEmitterMs !== null) {
      const relative = dispatcherMs !== null ? Math.round((tinyEmitterMs / dispatcherMs) * 100) : null;
      tinyEmitterStr = `${(tinyEmitterMs * 1000).toFixed(3)}us (${relative !== null ? relative + '%' : 'N/A'})`;
    }

    const results_row = {
      'Count': count.toString(),
      'Dispatcher Latency (us)': dispatcherStr,
      'EventTarget Latency (us)': eventTargetStr,
      'TinyEmitter Latency (us)': tinyEmitterStr,
    };

    results.push(results_row);
  }

  printTable('Emission Latency Benchmark', ['Count', 'Dispatcher Latency (us)', 'EventTarget Latency (us)', 'TinyEmitter Latency (us)'], results);
}

if (typeof process === 'object') {
  runEmissionLatencyBenchmark();
}
