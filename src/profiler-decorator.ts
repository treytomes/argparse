import {config} from './config';
import {logger} from './logger';

export function profilerDecorator<TTarget>(
  _target: TTarget,
  propertyName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  // Disable the profiler if we're not in debug mode.
  if (!config.get('debug')) return descriptor;

  const originalMethod = descriptor.value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = async function (...args: any[]): Promise<any> {
    // Set the start time of the execution
    const startTime = performance.now();

    // Invoke the original function with the provided arguments.
    const result = await originalMethod.apply(this, args);

    // Calculate the execution time of the original function.
    const executionTime = performance.now() - startTime;

    logger.info({
      profiler: propertyName,
      executionTime: `${(executionTime / 1000).toFixed(2)}ms`,
    });

    return result;
  };

  return descriptor;
}
