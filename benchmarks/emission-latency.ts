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

  // Listeners (no-ops)
  dispatcher.addEventListener('event1', () => {});
  dispatcher.addEventListener('event2', () => {});
  dispatcher.addEventListener('event3', () => {});

  const argCounts = [1, 5, 10];

  for (const count of argCounts) {
    console.log(`Arguments: ${count}`);
    console.log('-'.repeat(20));

    // Prepare data
    const payload = createMockPayload(1);
    let args: any[] = [];
    for (let i = 0; i < count; i++) {
      args.push(payload);
    }

    // Benchmark EventDispatcher by sending many events to reduce noise
    const iterations = 1000;
    const avgTyped = measureAverage(() => {
      for (let i = 0; i < iterations; i++) {
        if (count === 1) dispatcher.dispatchEvent('event1', ...args);
        else if (count === 3) dispatcher.dispatchEvent('event2', ...args);
        else if (count === 5) dispatcher.dispatchEvent('event3', ...args);
      }
    }, 10);

    // Divide by iterations to get average latency per single emission
    console.log(`EventDispatcher: ${avgTyped.toFixed(4)}ms`);

    console.log('-'.repeat(20));
  }
}

runEmissionLatencyBenchmark();
