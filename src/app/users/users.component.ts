import { Component, OnInit } from '@angular/core';
import { USERS, User } from '../users';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

const users: User[] = USERS;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dataSource = new MatTableDataSource<[]>();
  displayedColumns: string[] = ['name', 'email', 'gender', 'location', 'age', 'registration', 'phone_number', 'actions'];

  constructor(private usersService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers()
      .pipe((map(users => {
        this.dataSource.data = users['results'];
      })))
      .subscribe();

  }





}
