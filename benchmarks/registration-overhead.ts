import { measureAverage } from './utils/runner.ts';
import { EventDispatcher } from '../index.ts';

type MyEvents = {
  message: [string];
};

function runRegistrationBenchmark() {
  const counts = [10, 100, 500, 1000];

  console.log('Starting Registration Overhead Benchmark...');
  console.log(`Counts: ${counts.join(', ')}`);
  console.log('-'.repeat(40));

  for (const count of counts) {
    const task = () => {
      const dispatcher = new EventDispatcher<MyEvents>();

      // This is what we're benchmarking: the cost of registering many listeners on a single target.
      for (let i = 0; i < count; i++) {
        dispatcher.addEventListener('message', () => {
          // No-op listener for registration overhead test
        });
      }
    };

    const avgDuration = measureAverage(task, 5);
    console.log(`Count: ${count.toString().padEnd(6)} | Avg Duration: ${avgDuration.toFixed(4)}ms`);
  }
}

runRegistrationBenchmark();
