import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { APP_CONFIG } from './../app-config';



@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({



    clientID: APP_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: `palm`,

    // development:
     redirectUri: APP_CONFIG.redirectUri,
    //  production:
    // redirectUri: 'http://ec2-54-153-76-219.us-west-1.compute.amazonaws.com/',


    scope: 'openid'
  });

  constructor(public router: Router) {}

  public login(): void {


    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }


  public getAuthentication(): string {
    const accessToken = localStorage.getItem('access_token');
    const id_token = localStorage.getItem('id_token');


    //console.log("\n\n\n\n");
    //console.log("access token: " + accessToken);
    //console.log("id_token: " + id_token);
    
    //console.log("\n\n\n\n");

    return accessToken; 
  }


}
