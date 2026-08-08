import { measureAverage } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';
import { createMockPayload } from './data-factory.ts';

type MyEvents = {
  event1: [Record<string, any>];                     // 1 argument
  event2: [Record<string, any>, Record<string, any>, Record<string, any>]; // 3 arguments
  event3: [Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>]; // 5 arguments
};

function runEmissionLatencyBenchmark() {
  console.log('Starting Emission Latency Benchmark...');
  console.log('-'.repeat(40));

  const dispatcher = new EventDispatcher<MyEvents>();

  const argCounts = [1, 3, 5];

  let callCount = 0; // Add a side effect to avoid potential optimizations that could skew the benchmark results.
  // Listeners
  dispatcher.addEventListener('event1', () => { callCount++; });
  dispatcher.addEventListener('event2', () => { callCount++; });
  dispatcher.addEventListener('event3', () => { callCount++; });

  for (const count of argCounts) {
    const payload = createMockPayload(1);
    const args = Array.from({ length: count }, () => payload);

    // Benchmark EventDispatcher by sending many events to reduce noise
    const iterations = 1000;
    const avgTyped = measureAverage(() => {
      for (let i = 0; i < iterations; i++) {
        if (count === 1) dispatcher.dispatchEvent('event1', ...args);
        else if (count === 3) dispatcher.dispatchEvent('event2', ...args);
        else if (count === 5) dispatcher.dispatchEvent('event3', ...args);
      }
    }, 10);

    console.log(`Count: ${count.toString().padEnd(6)} | Avg Duration: ${avgTyped.toFixed(4)}ms`);
  }
}

runEmissionLatencyBenchmark();
