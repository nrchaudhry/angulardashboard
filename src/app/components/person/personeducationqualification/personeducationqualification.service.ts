import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";
import { PersonService } from "../person/person.service";

@Injectable({
  providedIn: "root"
})
export class  PersoneducationqualificationService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice:PersonService
  ) { }


  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personeducationqualification",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personeducationqualification/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personeducationqualification/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personeducationqualification",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personeducationqualification/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }


  updateAll(data) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personeducationqualification",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }


  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"personeducationqualification/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personeducationqualification/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personeducationqualification/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personeducationqualification/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personeducationqualification/advancedsearch/all",
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
      response.person_DETAIL = response.person.title + " " + response.person.forenames + " " + response.person.surname;
    }

    if (response.educationinstitute_DETAIL != null) {
      response.educationinstitute = JSON.parse(response.educationinstitute_DETAIL);
      response.educationinstitute_DETAIL = response.educationinstitute.code + ' - ' + response.educationinstitute.description;
    }

    if (response.educationattendancemode_DETAIL != null) {
      response.educationattendancemode = JSON.parse(response.educationattendancemode_DETAIL);
      response.educationattendancemode_DETAIL = response.educationattendancemode.code + ' - ' + response.educationattendancemode.description;
    }

    if (response.educationsystem_DETAIL != null) {
      response.educationsystem = JSON.parse(response.educationsystem_DETAIL);
      response.educationsystem_DETAIL = response.educationsystem.code + ' - ' + response.educationsystem.description;
    }

    if (response.gradingsystem_DETAIL != null) {
      response.gradingsystem = JSON.parse(response.gradingsystem_DETAIL);
      response.gradingsystem_DETAIL = response.gradingsystem.code + ' - ' + response.gradingsystem.description;
    }

    response.locations = [];
    response.location = JSON.parse(response.location_DETAIL);
    response.location_DETAIL = null;
    while (response.location.locationparent_ID != null) {
      response.locations.push(response.location);
      response.location = response.location.locationparent_ID;
    }
    response.locations.push(response.location);
    return(response);
  }
}
