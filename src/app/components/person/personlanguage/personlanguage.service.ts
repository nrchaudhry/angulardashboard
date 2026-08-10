import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";
import { PersonService } from "../person/person.service";

@Injectable({
  providedIn: "root"
})
export class  PersonlanguageService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice: PersonService
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
      response[a] = this.getDetails(response[a]);
    }
    return (response);
  }

  getDetail(response) {
    if (response.person_DETAIL != null) {
      response.person = this.personservice.getDetail(JSON.parse(response.person_DETAIL));
      response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;
    }

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

  getDetails(response) {
    if (response.person_DETAIL != null) {
      response.person = this.personservice.getDetails(JSON.parse(response.person_DETAIL));
      response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;
    }

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
