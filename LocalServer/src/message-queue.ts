import {
  BehaviorSubject,
  filter,
  from,
  interval,
  map,
  merge,
  mergeMap,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import SensorData from './types/data';

// 3 seconds
const RESEND_AFTER = 3_000;

export class MessageQueue {
  #queue$ = new BehaviorSubject<SensorData[]>([]);

  // events
  add$ = new Subject<SensorData>();
  delivered$ = new Subject<number>();

  // selectors
  get nextMessageToSend$() {
    return merge(from(this.#queue$.getValue()), this.add$).pipe(
      mergeMap((added) =>
        interval(RESEND_AFTER).pipe(
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
