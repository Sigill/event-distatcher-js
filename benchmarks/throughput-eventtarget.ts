import { measure } from './utils/runner.ts';
import { createMockPayload } from './data-factory.ts';

function runThroughputBenchmark() {
  console.log('Starting Native Throughput Benchmark...');
  console.log('-'.repeat(40));

  const nativeTarget = new EventTarget();

  // Listeners for common event counts (1, 3, 5) to match latency benchmarks focus
  const argCounts = [1, 3, 5];
  let callCount = 0; // Side effect to avoid optimization
  nativeTarget.addEventListener('event1', () => { callCount++; });
  nativeTarget.addEventListener('event2', () => { callCount++; });
  nativeTarget.addEventListener('event3', () => { callCount++; });

  for (const count of argCounts) {
    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);
    
    const volumes = [10_000, 50_000, 100_000];

    for (const volume of volumes) {
      let durationMs = 0;
      if (count === 1) {
        durationMs = measure(() => {
          for (let i = 0; i < volume; i++) nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event1', { detail: args[0] }));
        });
      } else if (count === 3) {
        durationMs = measure(() => {
          for (let i = 0; i < volume; i++) nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event2', { detail: args }));
        });
      } else if (count === 5) {
        durationMs = measure(() => {
          for (let i = 0; i < volume; i++) nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event3', { detail: args }));
        });
      }

      const eps = (volume / durationMs) * 1000;
      console.log(`Args: ${count.toString().padEnd(4)} | Volume: ${volume.toString().padEnd(8)} | Duration: ${durationMs.toFixed(2)}ms | EPS: ${eps.toFixed(0)}`);
    }
  }
}

runThroughputBenchmark();
