import { measureAverage } from './utils/runner.ts';
import { createMockPayload } from './data-factory.ts';

function runEmissionLatencyBenchmark() {

  console.log('Starting Native Emission Latency Benchmark...');
  console.log('-'.repeat(40));

  const nativeTarget = new EventTarget();

  const argCounts = [1, 3, 5];

  let callCount = 0; // Add a side effect to avoid potential optimizations that could skew the benchmark results.
  // Listeners
  nativeTarget.addEventListener('event1', () => { callCount++; });
  nativeTarget.addEventListener('event2', () => { callCount++; });
  nativeTarget.addEventListener('event3', () => { callCount++; });

  for (const count of argCounts) {
    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    // Benchmark native EventTarget by sending many events to reduce noise
    const iterations = 1000;
    const avgNative = measureAverage(() => {
      for (let i = 0; i < iterations; i++) {
        if (count === 1) nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event1', { detail: args[0] }));
        else if (count === 3) nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event2', { detail: args }));
        else if (count === 5) nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event3', { detail: args }));
      }
    }, 10);

    console.log(`Count: ${count.toString().padEnd(6)} | Avg Duration: ${avgNative.toFixed(4)}ms`);
  }
}

runEmissionLatencyBenchmark();
