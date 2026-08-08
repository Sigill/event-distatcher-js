import { measureAverage } from './utils/runner.ts';
import { createMockPayload } from './data-factory.ts';

function runEmissionLatencyBenchmark() {
  console.log('Starting Native Emission Latency Benchmark...');
  console.log('-'.repeat(40));

  const nativeTarget = new EventTarget();

  // Listeners (no-ops)
  nativeTarget.addEventListener('event1', () => {});
  nativeTarget.addEventListener('event2', () => {});
  nativeTarget.addEventListener('event3', () => {});

  const argCounts = [1, 5, 10];

  for (const count of argCounts) {
    console.log(`Arguments: ${count}`);
    console.log('-'.repeat(20));

    // Prepare data - Using the same factory as the typed benchmark
    const payload = createMockPayload(1);
    let args: any[] = [];
    for (let i = 0; i < count; i++) {
      args.push(payload);
    }

    // Benchmark native EventTarget by sending many events to reduce noise
    const iterations = 1000;
    const avgNative = measureAverage(() => {
      for (let i = 0; i < iterations; i++) {
        if (count === 1) nativeTarget.dispatchEvent(new CustomEvent('event1', { detail: args[0] }));
        else if (count === 3) nativeTarget.dispatchEvent(new CustomEvent('event2', { detail: args }));
        else if (count === 5) nativeTarget.dispatchEvent(new CustomEvent('event3', { detail: args }));
      }
    }, 10);

    // Divide by iterations to get average latency per single emission
    console.log(`Native EventTarget: ${(avgNative / iterations).toFixed(4)}ms`);

    console.log('-'.repeat(20));
  }
}

runEmissionLatencyBenchmark();
