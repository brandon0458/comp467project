import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { PaintComponent } from './../paint/paint.component';
import { HttpService } from './../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HttpService]
})
export class HomeComponent implements OnInit {

  getUser: String;
  postUser: String;


  constructor(public auth: AuthService, private httpService: HttpService) { }




  ngOnInit() {
  }

}
