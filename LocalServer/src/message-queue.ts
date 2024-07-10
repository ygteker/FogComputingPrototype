import 'dotenv/config';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  merge,
  mergeMap,
  Subject,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import SensorData from './types/data';

export class MessageQueue {
  #queue$ = new BehaviorSubject<SensorData[]>([]);
  #confirmationTimeout: number = parseInt(
    process.env.CONFIRMATION_TIMEOUT ?? '3000'
  );

  // events
  add$ = new Subject<SensorData>();
  delivered$ = new Subject<number>();

  // selectors
  get nextMessageToSend$() {
    return merge(from(this.#queue$.getValue()), this.add$).pipe(
      mergeMap((added) =>
        timer(0, this.#confirmationTimeout).pipe(
          takeUntil(this.getRemovedId(added.id)),
          map(() => added)
        )
      )
    );
  }

  constructor() {
    // reducers
    this.add$.subscribe((sData) =>
      this.#queue$.next([...this.#queue$.getValue(), sData])
    );
    this.delivered$.subscribe((id) =>
      this.#queue$.next(
        this.#queue$.getValue().filter((sData) => sData.id !== id)
      )
    );
  }

  private getRemovedId(removedId: number) {
    return this.delivered$.pipe(
      filter((id) => id === removedId),
      take(1)
    );
  }
}
