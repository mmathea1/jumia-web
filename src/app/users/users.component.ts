import { Component, OnInit } from '@angular/core';
import { USERS, User } from '../users';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';

const users: User[] = USERS;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  dataSource = new MatTableDataSource<User>(users);
  displayedColumns: string[] = ['name', 'email'];

  constructor(private usersService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(users => this.users = users);
  }





}
