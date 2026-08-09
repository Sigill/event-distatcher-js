# @sigill/event-dispatcher

A library providing strongly-typed event handling and `EventTarget` definitions.

## Overview

The `@sigill/event-dispatcher` provides an `EventDispatcher` class that allows you to dispatch events with specific, strongly-typed data payloads.

Unlike the native `EventTarget`, which dispatches wrapped `Event` objects, this dispatcher passes the raw arguments directly to your listeners. This makes it ideal for internal application logic where you want to avoid the overhead and boilerplate of creating `CustomEvent` instances.

## Features

- **Strongly Typed**: Define an `EventMap` to specify exactly what arguments each event should receive.
- **Raw Data Dispatching**: No need to wrap data in `Event` objects; payloads are passed directly as function arguments.
- **Lightweight**: Minimal overhead and a small footprint.

## Installation

```bash
npm install @sigill/event-dispatcher
# or
yarn add @sigill/event-dispatcher
```

## Usage

### Basic Example

Define an `Events` type that maps event names to their respective listener signatures:

```typescript
import { EventDispatcher } from '@sigill/event-dispatcher';

type Events = {
  'user-logged-in': (username: string, isAdmin: boolean) => void;
  'data-received': (payload: number[]) => void;
};

const dispatcher = new EventDispatcher<Events>();

// Register listeners
dispatcher.addEventListener('user-logged-in', (username, isAdmin) => {
  console.log(`User ${username} logged in. Admin status: ${isAdmin}`);
});

dispatcher.addEventListener('data-received', (payload) => {
  console.log('Received data:', payload);
});

// Dispatch events
dispatcher.dispatchEvent('user-logged-in', 'jdoe', true);
dispatcher.dispatchEvent('data-received', [1, 2, 3]);
```

### Removing Listeners

You can also remove specific listeners using `removeEventListener`:

```typescript
const logger = (username: string) => console.log(`Log: ${username}`);

dispatcher.addEventListener('user-logged-in', logger);
// ... later ...
dispatcher.removeEventListener('user-logged-in', logger);
```

## API Reference

### `EventDispatcher<Events>`

The main class for handling events.

#### `addEventListener<EventName>(eventName: EventName, listener: Events[EventName])`
Registers a new listener for the specified event.

#### `removeEventListener<EventName>(eventName: EventName, listener: Events[EventName])`
Removes a previously registered listener for the specified event.

#### `dispatchEvent<EventName>(eventName: EventName, ...data: Parameters<Events[EventName]>)`
Triggers all listeners associated with the specified event, passing the provided data as arguments.

## License

ISC
