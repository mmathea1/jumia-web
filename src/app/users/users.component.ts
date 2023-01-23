import { Component, OnInit, ViewChild } from '@angular/core';
import { USERS, User } from '../users';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  // displayedColumns: string[] = ['name', 'email', 'Gender', 'Location', 'Registration Seniority', 'Phone Number', 'Picture'];
  // @ViewChild(MatPaginator) paginator: MatPaginator;


  onSelect(user: User): void {
    this.selectedUser = user;
  }

  ngOnInit(): void {

  }

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }

}
