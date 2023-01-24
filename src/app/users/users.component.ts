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

  constructor(private usersService: UserService) { }

  users: User[] = [];
  dataSource = new MatTableDataSource<User>(users);
  selectedUser?: User;
  displayedColumns: string[] = ['name', 'email'];

  onSelect(user: User): void {
    this.selectedUser = user;
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(users => this.users = users);
  }
  ngOnInit(): void {
    this.getUsers();
  }



}
