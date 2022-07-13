import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http'
import { map } from "rxjs/operators";

import { LoginService } from '../pages/login/login.service';

@Injectable({
  providedIn: "root"
})
export class SidebarService {

  constructor(private http: Http, private loginService: LoginService) { }

  LoggedUserId = this.loginService.loaddetail();
  BaseUrl: any = this.loginService.loaddetail().oauthservice_PATH;

  userprivileges() {
    return this.http.post(
      this.BaseUrl + "login/userprivileges",
      { application_ID: this.loginService.loaddetail().application_ID },
      {
        headers: new Headers({
          "Content-Type": "application/json",
          grant_type: "password",
          authorization: "bearer " + this.loginService.loaddetail().basic_Token_
        })
      }
    ).pipe(map(res => res.json()));
  }
}


