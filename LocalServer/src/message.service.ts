import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  expand,
  filter,
  Observable,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { WebSocket } from 'ws';
import { MessageQueue } from './message-queue';
import SensorData from './types/data';

export class MessageService {
  #socketAddress: string;
  #socket: WebSocket | null = null;
  #messageQueue = new MessageQueue();
  #setSocketAlive$ = new BehaviorSubject<boolean>(false);
  #isSocketAlive$ = this.#setSocketAlive$
    .asObservable()
    .pipe(distinctUntilChanged());
  #messageDelivered$ = new BehaviorSubject<number | null>(null);
  messageDelivered$: Observable<number> = this.#messageDelivered$.pipe(
    filter((messageId): messageId is number => messageId != null)
  );

  constructor(socketAddress: string) {
    this.#socketAddress = socketAddress;
    console.log(`[WebSocket] Connecting to the websocket on ${socketAddress}`);
    this.init();
  }

  addMessageToQueue(message: SensorData) {
    this.#messageQueue.add$.next(message);
  }

  private init() {
    const delayIncrementMaxCount = 5;
    const maxReconnectionAttemptDelay =
      Math.pow(2, delayIncrementMaxCount) * 1_000;
    this.#isSocketAlive$
      .pipe(
        switchMap((alive) => {
          if (alive) {
            return EMPTY;
          }
          return of(null).pipe(
            // it doubles delay between attempts until it reaches maxReconnectionAttemptDelay
            expand((_, i) => {
              const delay = 1000 * Math.pow(2, Math.min(5, i));
              return timer(delay).pipe(
                tap(() => {
                  this.#socket = this.createWebSocket(
                    Math.min(maxReconnectionAttemptDelay, delay * 2)
                  );
                })
              );
            })
          );
        })
      )
      .subscribe();

    this.#isSocketAlive$
      .pipe(
        switchMap((isAlive) =>
          isAlive ? this.#messageQueue.nextMessageToSend$ : EMPTY
        )
      )
      .subscribe((sData) => this.send(sData));
    this.messageDelivered$.subscribe((messageId) =>
      this.#messageQueue.delivered$.next(messageId)
    );
  }

  private createWebSocket(retryDelay: number): WebSocket {
    const ws = new WebSocket(`ws://${this.#socketAddress}`);

    ws.onopen = () => {
      console.log(
        '[WebSocket] Connection successful. Start data transmission...'
      );
      this.#setSocketAlive$.next(true);
    };

    ws.onmessage = ({ data }) => {
      const parsedConfirmation = JSON.parse(data.toString()) as {
        id: number;
      };
      console.log(
        `[WebSocket] data point with id: ${parsedConfirmation.id} transmitted successfully`
      );
      this.#messageDelivered$.next(parsedConfirmation.id);
    };

    ws.onclose = () => {
      // check if it is a reconnection attempt
      if (!this.#setSocketAlive$.getValue()) {
        return;
      }
      console.log('[WebSocket] Connection closed. Reconnecting...');
      this.#setSocketAlive$.next(false);
    };

    ws.onerror = (error) => {
      // check if it is a reconnection attempt
      if (!this.#setSocketAlive$.getValue()) {
        console.error(
          `[WebSocket] Connection attempt failed. Retry in ${
            retryDelay / 1000
          } seconds...`
        );
        return;
      }
      console.error('[WebSocket] Connection error:', error);
      this.#setSocketAlive$.next(false);
    };

    return ws;
  }

  private send(sData: SensorData) {
    console.log('[WebSocket] sending data point with id: ' + sData.id);
    this.#socket?.send(JSON.stringify(sData));
  }
}
