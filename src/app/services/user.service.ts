import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'https://randomuser.me/api/?results=500';

  constructor(private http: HttpClient,) { }

  getUsers(): Observable<any> {
    return this.http.get(this.usersUrl);
  }
}
