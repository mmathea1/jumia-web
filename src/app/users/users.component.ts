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
import { Router } from '@angular/router';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectionAmount = 0;
  showTable = false;
  isLoading = false;
  dataLength = 0;
  dataSource = new MatTableDataSource<User>();
  dataSourceFilters = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);
  userFilters: UserFilter[] = [];
  filterDictionary = new Map<string, string>();
  displayedColumns = ['select', 'name', 'email', 'gender', 'location', 'dob', 'registered', 'phone', 'view_user'];
  exportColumns = ['first_name', 'last_name', 'dob', 'email', 'location', 'gender', 'phone', 'nat', 'registered'];
  genders: string[] = ['All', 'male', 'female'];
  nationalities: string[] = ['All', 'AU', 'BR', 'CA', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IN', 'IR', 'MX', 'NL', 'NO', 'NZ', 'RS', 'TR', 'UA', 'US'];

  constructor(
    private usersService: UserService,
    private exportService: ExportService,
    private _snackBar: MatSnackBar, private router: Router) { }


  ngOnInit(): void {
    this.getUsers();
    this.userFilters.push({ name: 'gender', options: this.genders, defaultValue: 'All' });
    this.userFilters.push({ name: 'nat', options: this.nationalities, defaultValue: 'All' });
    this.dataSourceFilters.filterPredicate = function (record, filter) {
      const map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (const [key, value] of map) {
        const k = key as keyof User;
        isMatch = (value == "All") || (record[k] == value);
        if (!isMatch) return false;
      }
      return isMatch;
    }

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'name': {
          return item[property]['first'];
        }
        case 'registered': {
          const newDate = new Date(item.registered.date);
          return newDate;
        }
        case 'location': {
          return item[property]['country'];
        }
        case 'dob': {
          return item[property]['age'];
        }
        default: {
          return item[property];
        }

      }

    };
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 1000
    });
  }

  getUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().pipe(
      map((res) => {
        const data = res['results'];
        this.dataLength = res['info']['results'];
        return Object.keys(data).map((k) => {
          const user: User =
          {
            name: data[k]['name'],
            id: data[k]['id'],
            email: data[k]['email'],
            location: data[k]['location'],
            picture: data[k]['picture'],
            gender: data[k]['gender'],
            dob: data[k]['dob'],
            registered: data[k]['registered'],
            phone: data[k]['phone'],
            nat: data[k]['nat']
          };
          return user;
        })
      })
    ).subscribe(data => {
      this.dataSourceFilters.data = this.dataSource.data = data;
      this.isLoading = false;
      this.dataLength > 0 ? this.showTable = true : this.showTable = false;
      this.selectionAmount = this.dataLength;
      this.openSnackBar(this.dataLength + ' results found', 'success');
    }, (error) => {
      this.isLoading = false;
      this.openSnackBar('An error occurred', 'error');
    });
  }

  exportFile(exportType: string): void {
    const date = new Date().toJSON().slice(0, 10).toString();
    const fileName = 'users_' + date;
    const data: any[] = [];
    let collection: any[] = [];
    this.selection.selected.length > 0 ? collection = this.selection.selected : collection = this.dataSource.data;
    collection.forEach((item) => {
      const user = {
        first_name: item.name.first,
        last_name: item.name.last,
        gender: item.gender,
        dob: item.dob.date,
        location: item.location.country,
        registered: item.registered.date,
        nat: item.nat,
        phone: item.phone
      }
      data.push(user);
    });
    const msg = this.exportService.exportFile(data, fileName, exportType, this.exportColumns);
    this.openSnackBar(msg, 'close');
  }


  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator!.pageSize;
    return numSelected === numRows;
  }

  selectRows(): void {
    for (let i = 0; i < this.dataSource.paginator!.pageSize; i++) {
      this.selection.select(this.dataSource.data[i]);
      this.selectionAmount = this.selection.selected.length;
    }
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectionAmount = this.dataLength;
    } else {
      this.selectRows();
      this.selectionAmount = this.selection.selected.length;

    }
  }

  searchFilter(event: Event): void {
    const filterText = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterText.trim().toLowerCase();
    this.openSnackBar(this.dataSource.filteredData.length + ' users found', 'close');
  }


  applyUserFilter(ob: MatSelectChange, userfilter: UserFilter) {
    this.filterDictionary.set(userfilter.name, ob.value);
    const jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSourceFilters.filter = jsonString;
    this.dataSource.data = this.dataSourceFilters.filteredData;
    this.openSnackBar(this.dataSourceFilters.filteredData.length + ' users found', 'close');
    this.selection.clear();
  }

  onChangedPageSize($event: any): void {
    if (this.selection.selected.length > 0) {
      this.selection.clear();
      this.toggleAllRows();
      this.selectionAmount = this.selection.selected.length;
    }
  }
  viewUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/user/' + user.id.value]);
  }

  selectToggle(user: any): void {
    this.selection.toggle(user);
    this.selectionAmount = this.selection.selected.length;
  }

}
