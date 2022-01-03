import { Injectable } from "@angular/core";
import { HttpCallServieService } from "../http-call-servie.service";
import { setting } from "../../setting";

@Injectable({
  providedIn: "root"
})
export class UniversityService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }

  get() {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "university",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "university/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getOne(id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "university/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "university",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "PUT",
      request_URI: "university/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "DELETE",
      request_URI: "university/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "university/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "university/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "university/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "university/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }


}
