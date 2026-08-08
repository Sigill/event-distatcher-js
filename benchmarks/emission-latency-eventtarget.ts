import { measureAverage } from './utils/runner.ts';
import { createMockPayload } from './data-factory.ts';

function runEmissionLatencyBenchmark() {
  console.log('Starting Native Emission Latency Benchmark...');
  console.log('-'.repeat(40));

  const nativeTarget = new EventTarget();

  let count = 0;
  // Listeners
  nativeTarget.addEventListener('event1', () => { count += 1; });
  nativeTarget.addEventListener('event2', () => { count += 1; });
  nativeTarget.addEventListener('event3', () => { count += 1; });

  const argCounts = [1, 3, 5];

  for (const count of argCounts) {
    console.log(`Arguments: ${count}`);
    console.log('-'.repeat(20));

    // Prepare data - Using the same factory as the typed benchmark
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

    // Divide by iterations to get average latency per single emission
    console.log(`Native EventTarget: ${avgNative.toFixed(4)}ms`);

    console.log('-'.repeat(20));
  }
}

runEmissionLatencyBenchmark();
