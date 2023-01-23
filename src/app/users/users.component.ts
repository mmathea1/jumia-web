import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { USERS, User } from '../users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor() { }
  users = USERS;
  selectedUser?: User;

  onSelect(user: User): void {
    this.selectedUser = user;
  }

  ngOnInit(): void {
  }

}
