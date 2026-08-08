/**
 * Mock data factory to generate identical payloads for both systems.
 */
export function createMockPayload(id: number): Record<string, any> {
  return {
    id,
    timestamp: Date.now(),
    data: {
      message: `Message ${id}`,
      metadata: {
        source: 'benchmark',
        priority: 'high',
        tags: ['test', 'bench'],
      },
    },
  };
}

/**
 * Generates a list of mock payloads.
 */
export function createMockPayloads(count: number): Record<string, any>[] {
  return Array.from({ length: count }, (_, i) => createMockPayload(i + 1));
}
