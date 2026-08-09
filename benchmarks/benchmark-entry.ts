import { runThroughputBenchmark } from './metrics/throughput/index.ts';
import { runRegistrationOverheadBenchmark } from './metrics/registration-overhead/index.ts';
import { runEmissionLatencyBenchmark } from './metrics/emission-latency/index.ts';

console.log('Starting Benchmark Suite...');

runRegistrationOverheadBenchmark();
runEmissionLatencyBenchmark();
runThroughputBenchmark();

console.log('Benchmark Suite Complete.');
