import { Component, OnInit, ViewChild } from '@angular/core';
import { USERS, User } from '../users';
import { MatTableDataSource } from '@angular/material/table';

const users: User[] = USERS;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor() { }
  dataSource = new MatTableDataSource<User>(users);
  selectedUser?: User;
  displayedColumns: string[] = ['name', 'email'];

  onSelect(user: User): void {
    this.selectedUser = user;
  }

  ngOnInit(): void {

  }

}
