import { WebSocket } from 'ws';
import { MessageQueue } from './message-queue';
import SensorData from './types/data';

export class MessageService {
  private socketAddress: string;
  private socket: WebSocket;
  private messageQueue = new MessageQueue();

  constructor(socketAddress: string) {
    this.socketAddress = socketAddress;
    this.socket = new WebSocket(`ws://${this.socketAddress}`);
    this.prepareMessagingTriggers();
  }

  private prepareMessagingTriggers() {
    this.messageQueue.added$.subscribe((sData) =>
      this.socket.send(JSON.stringify(sData))
    );
    this.socket.on('open', () => {
      console.log('Connected to the server');

      this.socket.on('message', (confirmation) => {
        const parsedConfirmation = JSON.parse(confirmation.toString()) as {
          id: number;
        };
        console.log(
          `Received confirmation for data point with id: ${parsedConfirmation.id}`
        );
        this.messageQueue.delivered$.next(parsedConfirmation.id);
      });

      this.socket.on('close', () => {
        console.log('Disconnected from the server');
      });

      this.socket.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
      });
    });
  }

  addMessageToQueue(message: SensorData) {
    this.messageQueue.add$.next(message);
  }
}
