import WebSocket from 'ws';
import { Intent, IntentReceiver } from './';

const dataLogger = new IntentReceiver('dataLogger');
dataLogger.registerIntentReceiver([{ action: 'data/xxx' }], (action, data) => {
  console.log('action', data);
});

const dataTester = new Intent('test');
dataTester
  .start()
  .then(test => test.next('data/xxx', { name: 'hello world' }).next('data/xxx', { name: 'hello world, again' }));

setTimeout(() => dataTester.end(), 1000);
