import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class SharedDataService {



  private meet = new BehaviorSubject('Meet Data');
  sharedMeet = this.meet.asObservable();



  constructor() {}



  nextMeeting(id: string): void {this.meet.next(id);
  }


}
