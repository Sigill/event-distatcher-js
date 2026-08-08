import { measureAverage } from './utils/runner.js';
import { EventDispatcher } from '../index.js';
import { createMockPayloads } from './data-factory.js';

type MyEvents = {
  message: [string];
};

async function runRegistrationBenchmark() {
  const counts = [10, 100, 500, 1000];

  console.log('Starting Registration Overhead Benchmark...');
  console.log(`Counts: ${counts.join(', ')}`);
  console.log('-'.repeat(40));

  for (const count of counts) {
    const task = async () => {
      const dispatcher = new EventDispatcher<MyEvents>();
      const payloads = createMockPayloads(count);

      // This is what we're benchmarking: the cost of registering many listeners on a single target.
      for (const payload of payloads) {
        dispatcher.addEventListener('message', () => {
          // No-op listener for registration overhead test
        });
      }
    };

    const { avgDuration } = await measureAverage(task, 5);
    console.log(`Count: ${count.toString().padEnd(6)} | Avg Duration: ${avgDuration.toFixed(4)}ms`);
  }
}

runRegistrationBenchmark().catch(console.error);
