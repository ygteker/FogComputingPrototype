import { BehaviorSubject, EMPTY, startWith, switchMap } from 'rxjs';
import { WebSocket } from 'ws';
import { MessageQueue } from './message-queue';
import SensorData from './types/data';

export class MessageService {
  #socketAddress: string;
  #socket: WebSocket;
  #messageQueue = new MessageQueue();
  #isSocketAlive$ = new BehaviorSubject<boolean>(false);

  constructor(socketAddress: string) {
    this.#socketAddress = socketAddress;
    this.#socket = new WebSocket(`ws://${this.#socketAddress}`);
    this.prepareMessagingTriggers();
    this.#isSocketAlive$.subscribe(console.log);
  }

  private prepareMessagingTriggers() {
    this.#isSocketAlive$
      .pipe(
        switchMap((isAlive) => (isAlive ? this.#messageQueue.added$ : EMPTY))
      )
      .subscribe((sData) => this.send(sData));

    setInterval(
      () => this.#isSocketAlive$.next(!this.#isSocketAlive$.getValue()),
      10000
    );

    this.#socket.on('open', () => {
      console.log('Connected to the server');
      this.#isSocketAlive$.next(true);

      this.#socket.on('message', (confirmation) => {
        const parsedConfirmation = JSON.parse(confirmation.toString()) as {
          id: number;
        };
        console.log(
          `Received confirmation for data point with id: ${parsedConfirmation.id}`
        );
        this.#messageQueue.delivered$.next(parsedConfirmation.id);
      });

      this.#socket.on('close', () => {
        console.log('Connection closed');
        this.#isSocketAlive$.next(false);
      });

      this.#socket.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
      });
    });
  }

  private send(sData: SensorData) {
    console.log('sending data with id: ' + sData.id);
    this.#socket.send(JSON.stringify(sData));
  }

  addMessageToQueue(message: SensorData) {
    this.#messageQueue.add$.next(message);
  }
}
