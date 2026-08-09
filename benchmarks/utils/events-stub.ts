export class EventEmitter {
  on() { return this; }
  emit() { return false; }
  once() { return this; }
  removeListener() { return this; }
  removeAllListeners() { return this; }
  setMaxListeners() { return this; }
}

export default { EventEmitter };
