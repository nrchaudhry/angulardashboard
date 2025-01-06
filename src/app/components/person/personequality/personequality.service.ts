import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";
import { PersonService } from "../person/person.service";

@Injectable({
  providedIn: 'root'
})
export class PersonequalityService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice :PersonService
  ) { }

  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personequality",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personequality/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personequality/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personequality",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personequality/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personequality",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"personequality/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personequality/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personequality/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personequality/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personequality/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }
  
   getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }

  getDetail(response) {
    if (response.person_DETAIL != null) {
      response.person = this.personservice.getDetail(JSON.parse(response.person_DETAIL));
      response.person_DETAIL = null
    }

    if (response.residential_DETAIL != null) {
      response.residential = JSON.parse(response.residential_DETAIL);
      response.residential_DETAIL = response.residential.code + ' - ' + response.residential.description;
    }

    if (response.domicile_DETAIL != null) {
      response.domicile = JSON.parse(response.domicile_DETAIL);
      response.domicile_DETAIL = response.domicile.code + ' - ' + response.domicile.description;
    }

    if (response.nationality_DETAIL != null) {
      response.nationality = JSON.parse(response.nationality_DETAIL);
      response.nationality_DETAIL = response.nationality.code + ' - ' + response.nationality.description;
    }

    if (response.maritalstatus_DETAIL != null) {
      response.maritalstatus = JSON.parse(response.maritalstatus_DETAIL);
      response.maritalstatus_DETAIL = response.maritalstatus.code + ' - ' + response.maritalstatus.description;
    }

    if (response.religion_DETAIL != null) {
      response.religion = JSON.parse(response.religion_DETAIL);
      response.religion_DETAIL = response.religion.code + ' - ' + response.religion.description;
    }


    if (response.ethnic_DETAIL != null) {
      response.ethnic = JSON.parse(response.ethnic_DETAIL);
      response.ethnic_DETAIL = response.ethnic.code + ' - ' + response.ethnic.description;
    }

    if (response.sexualorientation_DETAIL != null) {
      response.sexualorientation = JSON.parse(response.sexualorientation_DETAIL);
      response.sexualorientation_DETAIL = response.sexualorientation.code + ' - ' + response.sexualorientation.description;
    }

    if (response.gender_DETAIL != null) {
      response.gender = JSON.parse(response.gender_DETAIL);
      response.gender_DETAIL = response.gender.code + ' - ' + response.gender.description;
    }

    response.nationalities = [];
    response.location = JSON.parse(response.nationality_DETAIL);
    response.nationality_DETAIL = null;
    while (response.location.locationparent_ID != null) {
      response.nationalities.push(response.location);
      response.location = response.location.locationparent_ID;
    }
    response.nationalities.push(response.location);

    response.residentials = [];
    response.location = JSON.parse(response.residential_DETAIL);
    response.residential_DETAIL = null;
    while (response.location.locationparent_ID != null) {
      response.residentials.push(response.location);
      response.location = response.location.locationparent_ID;
    }
    response.residentials.push(response.location);

    response.domiciles = [];
    response.location = JSON.parse(response.domicile_DETAIL);
    response.domicile_DETAIL = null;
    while (response.location.locationparent_ID != null) {
      response.domiciles.push(response.location);
      response.location = response.location.locationparent_ID;
    }
    response.domiciles.push(response.location);
    return(response);
  }



}