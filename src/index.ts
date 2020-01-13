import { rejects } from 'assert';
import WebSocket from 'ws';

export interface IEndConfig {
  intentFilters?: IIntentFilter[];
  name: string;
}

export interface IIntent {
  action: string;
  data: any;
}

export interface IIntentFilter {
  action: string;
}

export class IntentReceiver {
  private readonly location: string;
  private ws: WebSocket;
  private readonly name: string;

  public constructor(name: string, location: string='ws://localhost:1248/') {
    this.name = name;
    this.location = location;
  }
  public registerIntentReceiver(intentFilters: IIntentFilter[], onIntent: (action: string, data: any) => void) {
    this.ws = new WebSocket(this.location);
    console.log(`[${this.name}] register()`);

    // 打开WebSocket连接后立刻发送一条消息:
    this.ws.on('open', () => {
      console.log(`[${this.name}] open()`);
      const end: IEndConfig = { intentFilters, name: this.name };
      this.ws.send(
        JSON.stringify({
          action: 'register',
          data: end,
        }),
      );
    });

    // 响应收到的消息:
    this.ws.on('message', message => {
      console.log(`[${this.name}] Received: ${message}`);
      try{
        const intent = JSON.parse(message) as IIntent;
        onIntent(intent.action, intent.data);
      }catch (e) {
        console.error("onIntent error", e);
      }
    });
    this.ws.on('close', () => {
      console.log(`[${this.name}] closed.`);
    });
    this.ws.on('error', (e)=> {
      console.error(`[${this.name}] error.`, e);
    })
  }

  public unRegister() {
    console.log(`[${this.name}] unRegister.`);
    this.ws.close();
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Intent {
  private readonly port: number;
  private ws: WebSocket;
  private readonly name: string;

  public constructor(name: string, port: number = 1248) {
    this.port = port;
    this.name = name;
  }

  public async start(): Promise<Intent> {
    return new Promise<Intent>((resolve, reject) => {
      this.ws = new WebSocket(`this.ws://localhost:${this.port}/`);

      // 打开WebSocket连接后立刻发送一条消息:
      this.ws.on('open', () => {
        console.log(`[${this.name}] open()`);
        resolve(this);
      });
    });
  }

  public next(action: string, data: any): Intent {
    this.ws.send(
      JSON.stringify({
        action,
        data,
      }),
    );
    return this;
  }

  public end() {
    console.log(`[${this.name}] unRegister.`);
    this.ws.close();
  }
}
