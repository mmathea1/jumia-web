import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { USERS, User } from '../users';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'https://randomuser.me/api/?results=500';

  constructor(private http: HttpClient,) { }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser(id: number): Observable<User> {
    const user = USERS.find(user => user.id === id)!;
    return of(user);
  }
}
