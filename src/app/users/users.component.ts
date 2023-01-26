import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../services/export.service';
import { User, UserFilter } from '../interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

const allowMultiSelect = true;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<User[]>();
  displayedColumns: string[] = ['select', 'name', 'email', 'gender', 'nat', 'age', 'registered', 'phone', 'view_user'];
  selection = new SelectionModel<any>(allowMultiSelect, []);
  isLoading: boolean = false;
  dataLength: number = 0;
  genders: string[] = ['All', 'male', 'female'];
  nationalities: string[] = ['All', 'AU', 'BR', 'CA', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IN', 'IR', 'MX', 'NL', 'NO', 'NZ', 'RS', 'TR', 'UA', 'US'];
  userFilters: UserFilter[] = [];
  filterDictionary = new Map<string, string>();
  selectionAmount: number = 0;

  constructor(
    private usersService: UserService,
    private exportService: ExportService,
    private _snackBar: MatSnackBar) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getUsers();
    this.userFilters.push({ name: 'gender', options: this.genders, defaultValue: 'All' });
    this.userFilters.push({ name: 'nat', options: this.nationalities, defaultValue: 'All' });
    this.dataSource.filterPredicate = function (record, filter) {
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        var k: any = key as keyof User;
        isMatch = (value == "All") || (record[k] == value);
        if (!isMatch) return false;
      }
      return isMatch;
    }
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000
    });
  }

  getUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers()
      .pipe((map(users => {
        var res = users['results'];
        // TODO: push User objects
        var data: any = [];
        for (var i = 0; i < res.length; i++) {
          var user: User = {
            id: res[i]['id'].value,
            name: res[i]['name'].first + ' ' + res[i]['name'].last,
            email: res[i]['email'],
            gender: res[i]['gender'],
            nat: res[i]['nat'],
            age: res[i]['dob'].age,
            registered: res[i]['registered'].age,
            phone: res[i]['phone']
          };
          data.push(user);
        }

        this.dataSource.data = data;
        this.selectionAmount = this.dataLength = this.dataSource.data.length;
        this.isLoading = false;
        this.openSnackBar(this.dataLength + ' users found', 'close');
      })))
      .subscribe();
  }

  exportFile(exportType: string): void {
    var date = new Date().toJSON().slice(0, 10).toString();
    var fileName = 'users_' + date;
    var data = this.selection.selected.length > 0 ? this.selection.selected : this.dataSource.data;
    if (exportType === 'xml') {
      this.exportService.exportFile(data, fileName, 'xml', this.displayedColumns);
    } else {
      this.exportService.exportFile(data, fileName, 'csv', this.displayedColumns);
    }
    this.openSnackBar(exportType + ' export complete', 'close');
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator!.pageSize
    return numSelected === numRows;
  }

  selectRows(): void {
    for (let i = 0; i < this.dataSource.paginator!.pageSize; i++) {
      this.selection.select(this.dataSource.data[i]);
      this.selectionAmount = this.selection.selected.length;
    }
  }

  toggleAllRows(): void {
    this.isAllSelected() ? this.selection.clear() : this.selectRows();
  }


  applyUserFilter(ob: MatSelectChange, userfilter: UserFilter) {
    this.filterDictionary.set(userfilter.name, ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
    this.openSnackBar(this.dataSource.filteredData.length + ' users found', 'close');

  }


}
