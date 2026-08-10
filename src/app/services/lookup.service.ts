import { Injectable } from "@angular/core";

import { setting } from "../setting";
import { HttpCallServieService } from "../services/http-call-servie.service";

@Injectable({
  providedIn: "root"
})
export class LookupService {

  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }

  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"lookup",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"lookup/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"lookup/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"lookup/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"lookup/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  lookup(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup/entity",
      request_BODY: JSON.stringify({ entityname: data })
    }
    return this._HttpCallServieService_.api(postData);
  }

  lookupAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"lookup/entity/all",
      request_BODY: JSON.stringify({ entityname: data })
    }
    return this._HttpCallServieService_.api(postData);
  }

  entityList() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"lookup/entitylist",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

}