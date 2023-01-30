import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: any = {};
  noUser = false;

  constructor(
    private location: Location,
  ) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    this.user = userString !== null ? JSON.parse(userString) : {};
    this.user == null || this.user == 'undefined' || JSON.stringify(this.user) === '{}' ? this.noUser = false : this.noUser = true;
  }

  goBack(): void {
    localStorage.clear();
    this.location.back();
  }
}
