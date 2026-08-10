import { Injectable } from '@angular/core';

import { HttpCallServieService } from "../services/http-call-servie.service";
import { setting } from '../setting';

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
      request_URI: setting.commonServicePath+"find/" + postcode + "?api-key=V4QHzniNakGufrLJgB3ROw29270&expand=true",
      request_BODY: ""
    }

    return this._HttpCallServieService_.api(postData);
  }
}
