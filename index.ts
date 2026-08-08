export interface EventMap {
  [eventName: string]: Array<unknown>;
};

export type EventListener<Data extends Array<unknown>> = (...data: Data) => void;

/**
 * EventDispatcher class
 *
 * A strongly-typed dispatcher for handling events with specific data payloads.
 * Unlike the native EventTarget, this class dispatches raw data directly
 * rather than wrapped Event objects.
 *
 * @template Events - Event map
 *
 * @example
 * ```typescript
 * interface Events {
 *   'event1': [string];
 *   'event2': [number, string];
 * }
 *
 * const dispatcher = new EventDispatcher<Events>();
 *
 * dispatcher.addEventListener('event1', (data) => {
 *   console.log(data);
 * });
 *
 * dispatcher.dispatchEvent('event1', 'hello');
 * ```
 */
export class EventDispatcher<Events extends EventMap> {
  #listeners: {
    [K in keyof Events]?: Array<EventListener<Events[K]>>;
  } = {};

  addEventListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: EventListener<Events[EventName]>
  ) {
    (this.#listeners[eventName] ??= []).push(listener);
  }

  removeEventListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: EventListener<Events[EventName]>
  ) {
    if (this.#listeners[eventName] !== undefined) {
      const index = this.#listeners[eventName].indexOf(listener);
      if (index !== -1) {
        this.#listeners[eventName].splice(index, 1);
      }
    }
  }

  dispatchEvent<EventName extends keyof Events>(
    eventName: EventName,
    ...data: Events[EventName]
  ) {
    if (this.#listeners[eventName] !== undefined) {
      for (const listener of this.#listeners[eventName]) {
        listener(...data);
      }
    }
  }
}
