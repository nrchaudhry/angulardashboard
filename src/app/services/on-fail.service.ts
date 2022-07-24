import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { LoginService } from '../pages/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class OnFailService {

  constructor(
    private _toaster: ToastrService,
    private _loginService: LoginService
  ) { }

  onFail(ifFail) {
    if (ifFail.error == "invalid_token") {
      this._toaster.warning("Internal session expired. Logged in again ", "Logged out");
      this._loginService.logout();
      return;
    }
    if (ifFail.status == 0) {
      this._toaster.error("Connection timed out", "Error");
      return;
    }
    if (ifFail.status == 404) {
      this._toaster.error("unknown error occured", "Error");
      return;
    }
    if (ifFail.hasOwnProperty("_body")) {
      let body = JSON.parse(ifFail._body);
      var fail = {};
      if (!ifFail) {
        this._toaster.error("unknown error occured", "Error");
        return;
      } else if (!ifFail._body) {
        this._toaster.error("unknown error occured", "Error");
        return;
      } if (ifFail.hasOwnProperty("_body")) {
        if (body.status == 400) {
          this._toaster.error("unknown error occured", "Error");
          return;
        } else if (body.error == "invalid_token") {
          this._toaster.warning("Internal session expired. Logged in again ", "Logged out");
          this._loginService.logout();
          return;
        } else {
          this._toaster.error("unknown error occured", "Error");
          return;
        }
      } else {
        this._toaster.error("Status: " + ifFail.status + " Error: " + body.error + " Message: " + body.error_description, "Error");
      }
    } else if (ifFail.hasOwnProperty("message")) {
      this._toaster.warning("Message", " " + ifFail.message);
      return;
    } else {
      this._toaster.error("check your internet connection", "Error");
      return;
    }

  }
}
