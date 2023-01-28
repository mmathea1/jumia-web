import { Component, OnInit, Input } from '@angular/core';
import { User } from '../interfaces';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  // @Input() user?: User;
  user: any = {};

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    this.user = userString !== null ? JSON.parse(userString) : {
      "id": "954860987",
      "name": "Juliette Gagnon",
      "email": "juliette.gagnon@example.com",
      "gender": "female",
      "nationality": "CA",
      "age": 74,
      "registered": 10,
      "phone": "P65 Q35-7824"
    };


    console.log(this.user);
  }


  goBack(): void {
    this.location.back();
  }
}
