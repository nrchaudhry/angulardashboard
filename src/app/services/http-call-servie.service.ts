import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map, catchError } from "rxjs/operators";

import { LoginService } from "../pages/login/login.service";

@Injectable({
  providedIn: 'root'
})
export class HttpCallServieService {

  constructor(
    private http: Http,
    private loginService: LoginService
  ) { }

  BaseUrl: any = this.loginService.loaddetail().applicationservice_PATH;
  AuthUrl: any = this.loginService.loaddetail().oauthservice_PATH;

  api(postData) {
    return this.http.post(this.BaseUrl + "apigateway", postData).pipe(map(res => res.json()));
  }

}

