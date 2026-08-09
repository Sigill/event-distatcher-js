export type EventMap<L> = {
  [E in keyof L]: (...args: any[]) => void;
};

export type DefaultListener = {
  [k: string]: (...args: unknown[]) => void;
};

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
 * type Events = {
 *   'event1': (a: string) => void;
 *   'event2': (a: number, b: string) => void;
 * };
 *
 * const dispatcher = new EventDispatcher<Events>();
 *
 * dispatcher.addEventListener('event1', (a) => {
 *   console.log(a);
 * });
 *
 * dispatcher.dispatchEvent('event1', 'hello');
 * ```
 */
export class EventDispatcher<Events extends EventMap<Events> = DefaultListener> {
  #listeners: {
    [EventName in keyof Events]?: Array<Events[EventName]>;
  } = {};

  addEventListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Events[EventName]
  ) {
    (this.#listeners[eventName] ??= []).push(listener);
  }

  removeEventListener<EventName extends keyof Events>(
    eventName: EventName,
    listener: Events[EventName]
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
    ...data: Parameters<Events[EventName]>
  ) {
    if (this.#listeners[eventName] !== undefined) {
      for (const listener of this.#listeners[eventName]) {
        listener(...data);
      }
    }
  }
}
