import { describe, it, expect, vi } from 'vitest';
import { EventDispatcher } from './index';

type MyEvents = {
  'test-event': [string];
  'numeric-event': [number, number];
};

describe('EventDispatcher', () => {

  it('should register and dispatch an event with a string payload', () => {
    const dispatcher = new EventDispatcher<MyEvents>();
    const callback = vi.fn();

    dispatcher.addEventListener('test-event', callback);
    dispatcher.dispatchEvent('test-event', 'hello');

    expect(callback).toHaveBeenCalledWith('hello');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should register and dispatch an event with multiple numeric payloads', () => {
    const dispatcher = new EventDispatcher<MyEvents>();
    const callback = vi.fn();

    dispatcher.addEventListener('numeric-event', callback);
    dispatcher.dispatchEvent('numeric-event', 1, 2);

    expect(callback).toHaveBeenCalledWith(1, 2);
  });

  it('should support multiple listeners for the same event', () => {
    const dispatcher = new EventDispatcher<MyEvents>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    dispatcher.addEventListener('test-event', callback1);
    dispatcher.addEventListener('test-event', callback2);
    dispatcher.dispatchEvent('test-event', 'multi');

    expect(callback1).toHaveBeenCalledWith('multi');
    expect(callback2).toHaveBeenCalledWith('multi');
  });

  it('should remove a listener correctly', () => {
    const dispatcher = new EventDispatcher<MyEvents>();
    const callback = vi.fn();

    dispatcher.addEventListener('test-event', callback);
    dispatcher.removeEventListener('test-event', callback);
    dispatcher.dispatchEvent('test-event', 'gone');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should do nothing if dispatching an event with no listeners', () => {
    const dispatcher = new EventDispatcher<MyEvents>();
    // Should not throw
    expect(() => {
      dispatcher.dispatchEvent('test-event', 'no one is listening');
    }).not.toThrow();
  });

  it('should handle removing a non-existent listener gracefully', () => {
    const dispatcher = new EventDispatcher<MyEvents>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    dispatcher.addEventListener('test-event', callback1);
    // Should not throw even if we try to remove something that wasn't added
    expect(() => {
      dispatcher.removeEventListener('test-event', callback2);
    }).not.toThrow();
  });
});
