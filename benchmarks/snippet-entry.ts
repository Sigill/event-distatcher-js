import { runThroughputBenchmark } from './throughput.ts';
import { runRegistrationOverheadBenchmark } from './registration-overhead.ts';
import { runEmissionLatencyBenchmark } from './emission-latency.ts';

console.log('Starting Benchmark Suite...');

runRegistrationOverheadBenchmark();
runEmissionLatencyBenchmark();
runThroughputBenchmark();

console.log('Benchmark Suite Complete.');
