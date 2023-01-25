import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../services/export.service';
import { User } from '../users';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dataSource = new MatTableDataSource<User[]>();
  displayedColumns: string[] = ['name', 'email', 'gender', 'location', 'age', 'registered', 'phone', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usersService: UserService, private exportService: ExportService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers()
      .pipe((map(users => {
        var res = users['results'];
        var data: any = [];
        for (var i = 0; i < res.length; i++) {
          var user: User = {
            id: res[i]['id'].value,
            name: res[i]['name'].first + ' ' + res[i]['name'].last,
            email: res[i]['email'],
            gender: res[i]['gender'],
            location: res[i]['location'].country,
            age: res[i]['dob'].age,
            registered: res[i]['registered'].age,
            phone: res[i]['phone']
          };
          data.push(user);
        }

        this.dataSource.data = data;
      })))
      .subscribe();
  }

  exportFile(exportType: string): void {
    var date = new Date().toJSON().slice(0, 10).toString();
    var fileName = 'users_' + date;
    if (exportType === 'xml') {
      this.exportService.exportFile(this.dataSource.data, fileName, 'xml', this.displayedColumns);
    } else {
      this.exportService.exportFile(this.dataSource.data, fileName, 'csv', this.displayedColumns);
    }
  }




}
