import { measureAverage } from './utils/runner.ts';

function runEventTargetRegistrationBenchmark() {
  const counts = [10, 100, 500, 1000];

  console.log('Starting EventTarget Registration Overhead Benchmark...');
  console.log(`Counts: ${counts.join(', ')}`);
  console.log('-'.repeat(40));

  for (const count of counts) {
    const task = () => {
      const target = new EventTarget();

      // Try to increase or remove the listener limit if available.
      target.setMaxListeners?.(0);

      // This is what we're benchmarking: the cost of registering many listeners on a native target.
      for (let i = 0; i < count; i++) {
        target.addEventListener('message', () => {
          // No-op listener for registration overhead test
        });
      }
    };

    const avgDuration = measureAverage(task, 5);
    console.log(`Count: ${count.toString().padEnd(6)} | Avg Duration: ${avgDuration.toFixed(4)}ms`);
  }
}

runEventTargetRegistrationBenchmark();
