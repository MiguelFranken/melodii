import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private isClosed = false; // current value of isClosedSubject
  private isClosedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  getIsClosedObservable(): Observable<boolean> {
    return this.isClosedSubject.asObservable();
  }

  switchNavigation() {
    this.isClosed = !this.isClosed;
    this.isClosedSubject.next(this.isClosed);
  }
}
