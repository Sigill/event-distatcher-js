import { measure } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';
import { createMockPayload } from './data-factory.ts';

function runThroughputBenchmark() {
  console.log('Starting Typed EventDispatcher Throughput Benchmark...');
  console.log('-'.repeat(40));

  type MyEvents = {
    event1: [Record<string, any>];
    event2: [Record<string, any>, Record<string, any>, Record<string, any>];
    event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>];
  };

  const dispatcher = new EventDispatcher<MyEvents>();

  // Listeners for common event counts (1, 3, 5) to match latency benchmarks focus
  const argCounts = [1, 3, 5];
  let callCount = 0; // Side effect to avoid optimization
  dispatcher.addEventListener('event1', () => { callCount++; });
  dispatcher.addEventListener('event2', () => { callCount++; });
  dispatcher.addEventListener('event3', () => { callCount++; });

  for (const count of argCounts) {
    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    const volumes = [10_000, 50_000, 100_000];

    for (const volume of volumes) {
      let durationMs = 0;
      if (count === 1) {
        durationMs = measure(() => {
          for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event1', ...args);
        });
      } else if (count === 3) {
        durationMs = measure(() => {
          for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event2', ...args);
        });
      } else if (count === 5) {
        durationMs = measure(() => {
          for (let i = 0; i < volume; i++) dispatcher.dispatchEvent('event3', ...args);
        });
      }

      const eps = (volume / durationMs) * 1000;
      console.log(`Args: ${count.toString().padEnd(4)} | Volume: ${volume.toString().padEnd(8)} | Duration: ${durationMs.toFixed(2)}ms | EPS: ${eps.toFixed(0)}`);
    }
  }
}

runThroughputBenchmark();
