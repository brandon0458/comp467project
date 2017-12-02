import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth/auth.service';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from './app-config';



@Injectable()
export class HttpService {
  constructor(private http: Http, private authService: AuthService) {}

  getCanvas() 
  {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getAuthentication());
    return this.http.get( APP_CONFIG.serverURL + '/open', {headers: headers, body: ''})
    .map(res => res)
  }

  postCanvas(canvas: string) 
  {
    let headers = new Headers();   
    headers.append('Authorization', 'Bearer ' + this.authService.getAuthentication());
    return this.http.post(APP_CONFIG.serverURL + '/save', canvas, {headers: headers})
    .map(res => res)
  }
}
