import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import {HttpClient} from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import {Observable} from 'rxjs';

import { LoginService } from "../pages/login/login.service";

@Injectable({
  providedIn: 'root'
})
export class HttpCallServieService {

  constructor(
    private http: Http,
    private httpclient: HttpClient,
    private loginService: LoginService
  ) { }

  BaseUrl: any = this.loginService.loaddetail().applicationservice_PATH;
  AuthUrl: any = this.loginService.loaddetail().oauthservice_PATH;

  api(postData) {
    return this.http.post(this.BaseUrl + "apigateway", postData).pipe(map(res => res.json()));
  }

  getTitle() {
    return this.http.get(this.AuthUrl + "login/usertitle").pipe(map(res => res.json()));
  }

  upload(file):Observable<any> {
    const formData = new FormData(); 
    formData.append("file", file, file.name);
    formData.append("application_ID", "1");
    formData.append("folder", "test");

    return this.httpclient.post(this.BaseUrl + "apigateway/googledrive/upload", formData);
  }

}

