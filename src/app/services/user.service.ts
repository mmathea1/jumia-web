import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { USERS, User } from '../users';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }


  getUsers(): Observable<User[]> {
    const users = of(USERS);
    return users;
  }

  getUser(id: number): Observable<User> {
    const user = USERS.find(user => user.id === id)!;
    return of(user);
  }
}
