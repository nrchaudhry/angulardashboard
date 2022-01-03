import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }

  get() {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "campus",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "campus/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "campus/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "campus",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "PUT",
      request_URI: "campus/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "DELETE",
      request_URI: "campus/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "campus/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "campus/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "campus/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "campus/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }


}
