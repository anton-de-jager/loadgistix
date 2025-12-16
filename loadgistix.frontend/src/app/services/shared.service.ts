import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private eventSubject = new Subject<any>();
  event$ = this.eventSubject.asObservable();

  triggerEvent(value: any) {
    this.eventSubject.next(value);
  }
}