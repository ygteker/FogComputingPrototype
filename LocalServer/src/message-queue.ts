import {
  BehaviorSubject,
  filter,
  from,
  interval,
  map,
  merge,
  mergeMap,
  share,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import SensorData from './types/data';

// 3 seconds
const RESEND_AFTER = 3_000;

export class MessageQueue {
  #queue$ = new BehaviorSubject<SensorData[]>([]);

  add$ = new Subject<SensorData>();
  delivered$ = new Subject<number>();

  #added$ = this.add$.pipe(tap(console.log));

  constructor() {
    this.add$.subscribe((sData) =>
      this.#queue$.next([...this.#queue$.getValue(), sData])
    );
    this.delivered$.subscribe((id) =>
      this.#queue$.next(
        this.#queue$.getValue().filter((sData) => sData.id !== id)
      )
    );
  }

  get added$() {
    return merge(this.#queuedMessages$, this.#added$).pipe(
      mergeMap((added) =>
        interval(RESEND_AFTER).pipe(
          takeUntil(this.getRemovedId(added.id)),
          map(() => added)
        )
      )
    );
  }

  private getRemovedId(removedId: number) {
    return this.delivered$.pipe(
      filter((id) => id === removedId),
      take(1)
    );
  }

  get #queuedMessages$() {
    console.log(this.#queue$.getValue());
    return from(this.#queue$.getValue());
  }
}
