import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../services/export.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dataSource = new MatTableDataSource<[]>();
  displayedColumns: string[] = ['name', 'email', 'gender', 'location', 'age', 'registration', 'phone_number', 'actions'];
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
        this.dataSource.data = users['results'];
      })))
      .subscribe();

  }

  exportToCSV(): void {
    var date = new Date().toLocaleString();
    var fileName = 'users' + date;
    this.exportService.exportToCSV(this.dataSource.data, fileName, this.displayedColumns);
  }

  exportToXML(): void {
    var date = new Date().toLocaleString();
    var fileName = 'users' + date;
    this.exportService.exportToXML(this.dataSource.data, fileName, this.displayedColumns);
  }



}
