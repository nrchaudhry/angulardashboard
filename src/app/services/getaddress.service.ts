import { Injectable } from '@angular/core';

import { HttpCallServieService } from "../services/http-call-servie.service";

@Injectable({
  providedIn: 'root'
})
export class GetaddressService {

  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }

  getByPostcode(postcode) {
    var postData = {
      service_NAME: "GETADDRESS",
      request_TYPE: "GET",
      request_URI: "find/" + postcode + "?api-key=V4QHzniNakGufrLJgB3ROw29270&expand=true",
      request_BODY: ""
    }

    return this._HttpCallServieService_.api(postData);
  }
}
