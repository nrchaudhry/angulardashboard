import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";

@Injectable({
  providedIn: "root"
})
export class  PersonlanguageService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personlanguage",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personlanguage/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personlanguage/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personlanguage",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personlanguage/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"personlanguage/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personlanguage/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personlanguage/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personlanguage/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personlanguage/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a].person = JSON.parse(response[a].person_DETAIL);
      response[a].person_DETAIL = null;

      if (response[a].language_DETAIL != null) {
        response[a].language = JSON.parse(response[a].language_DETAIL);
        response[a].language_DETAIL = response[a].language.code + ' - ' + response[a].language.description;
      }

      if (response[a].competency_DETAIL != null) {
        response[a].competency = JSON.parse(response[a].competency_DETAIL);
        response[a].competency_DETAIL = response[a].competency.code + ' - ' + response[a].competency.description;
      }
      if (response[a].fluency_DETAIL != null) {
        response[a].fluency = JSON.parse(response[a].fluency_DETAIL);
        response[a].fluency_DETAIL = response[a].fluency.code + ' - ' + response[a].fluency.description;
      }
    }
    return (response);
  }

  getDetail(response) {
    response.person = JSON.parse(response.person_DETAIL);
    response.person_DETAIL = null;

   
    if (response.language_DETAIL != null) {
      response.language = JSON.parse(response.language_DETAIL);
      response.language_DETAIL = response.language.description;
    }

    if (response.competency_DETAIL != null) {
      response.competency = JSON.parse(response.competency_DETAIL);
      response.competency_DETAIL = response.competency.code + ' - ' + response.competency.description;
    }

    if (response.fluency_DETAIL != null) {
      response.fluency = JSON.parse(response.fluency_DETAIL);
      response.fluency_DETAIL = response.fluency.code + ' - ' + response.fluency.description;
    }
    return (response);
  }

}
