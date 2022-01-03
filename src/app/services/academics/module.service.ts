import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";


@Injectable({
  providedIn: "root"
})
export class ModuleService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "module",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "module/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "GET",
      request_URI: "module/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "module",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  addmodulelearningoutcome(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "modulelearningoutcome",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }
  addmoduleassessmentcriteria(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "moduleassessmentcriteria",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "PUT",
      request_URI: "module/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "PUT",
      request_URI: "module",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "DELETE",
      request_URI: "module/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "module/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "module/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "module/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "module/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAlloutcome(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "modulelearningoutcome/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAllassessment(data) {
    var postData = {
      service_NAME: setting.service_NAME,
      request_TYPE: "POST",
      request_URI: "moduleassessmentcriteria/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }


}
