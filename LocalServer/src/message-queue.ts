import {
  BehaviorSubject,
  filter,
  interval,
  map,
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
  #queue = new BehaviorSubject<SensorData[]>([]);

  add$ = new Subject<SensorData>();
  delivered$ = new Subject<number>();

  #added$ = this.add$.pipe(
    tap((sData) => this.#queue.next([...this.#queue.getValue(), sData]))
  );

  #delivered$ = this.delivered$.pipe(
    tap((id) =>
      this.#queue.next(
        this.#queue.getValue().filter((sData) => sData.id !== id)
      )
    ),
    share()
  );

  constructor() {
    this.#added$.subscribe();
    this.#delivered$.subscribe();
  }

  get queue$() {
    return this.#queue.asObservable();
  }
  get added$() {
    return this.#added$.pipe(
      mergeMap((added) =>
        interval(RESEND_AFTER).pipe(
          takeUntil(this.getRemovedId(added.id)),
          map(() => added)
        )
      )
    );
  }

  private getRemovedId(removedId: number) {
    return this.#delivered$.pipe(
      filter((id) => id === removedId),
      take(1)
    );
  }
}
