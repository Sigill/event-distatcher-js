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

    let measureMs = 0;
    if (count === 1) {
      measureMs = measureAverage(() => nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event1', { detail: args[0] })), 1000);
    } else if (count === 3) {
      measureMs = measureAverage(() => nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event2', { detail: args })), 1000);
    } else if (count === 5) {
      measureMs = measureAverage(() => nativeTarget.dispatchEvent(new CustomEvent<Record<string, any>>('event3', { detail: args })), 1000);
    }

    console.log(`Count: ${count.toString().padEnd(6)} | Avg Duration: ${(measureMs * 1000).toFixed(3)}us`);
  }
}

runEmissionLatencyBenchmark();
