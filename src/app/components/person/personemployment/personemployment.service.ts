import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";
import { PersonService } from "../person/person.service";

@Injectable({
  providedIn: "root"
})
export class PersonemploymentService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice: PersonService
  ) { }


  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personemployment",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personemployment/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personemployment/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personemployment",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personemployment/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personemployment",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"personemployment/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personemployment/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personemployment/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personemployment/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personemployment/advancedsearch/all",
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

    if (response.worktype_DETAIL != null) {
      response.worktype = JSON.parse(response.worktype_DETAIL);
      response.worktype_DETAIL = response.worktype.code + ' - ' + response.worktype.description;
    }

    if (response.workfield_DETAIL != null) {
      response.workfield = JSON.parse(response.workfield_DETAIL);
      response.workfield_DETAIL = response.workfield.code + ' - ' + response.workfield.description;
    }

    if (response.careerlevel_DETAIL != null) {
      response.careerlevel = JSON.parse(response.careerlevel_DETAIL);
      response.careerlevel_DETAIL = response.careerlevel.code + ' - ' + response.careerlevel.description;
    }

    if (response.organizationsector_DETAIL != null) {
      response.organizationsector = JSON.parse(response.organizationsector_DETAIL);
      response.organizationsector_DETAIL = response.organizationsector.code + ' - ' + response.organizationsector.description;
    }

    if (response.organizationcategory_DETAIL != null) {
      response.organizationcategory = JSON.parse(response.organizationcategory_DETAIL);
      response.organizationcategory_DETAIL = response.organizationcategory.code + ' - ' + response.organizationcategory.description;
    }

    if (response.organizationtype_DETAIL != null) {
      response.organizationtype = JSON.parse(response.organizationtype_DETAIL);
      response.organizationtype_DETAIL = response.organizationtype.code + ' - ' + response.organizationtype.description;
    }

    response.address = response.address_LINE1;
    if (response.address_LINE2 != null && response.address_LINE2 != '')
      response.address = response.address + ", " + response.address_LINE2;
    if (response.address_LINE3 != null && response.address_LINE3 != '')
      response.address = response.address + ", " + response.address_LINE3;
    if (response.address_LINE4 != null && response.address_LINE4 != '')
      response.address = response.address + ", " + response.address_LINE4;
    if (response.address_LINE5 != null && response.address_LINE5 != '')
      response.address = response.address + ", " + response.address_LINE5;

    response.locations = [];
    response.location = JSON.parse(response.location_DETAIL);
    response.location_DETAIL = null;
    while (response.location.locationparent_ID != null) {
      response.address = response.address + ", " + response.location.location_NAME;
      response.locations.push(response.location);
      response.location = response.location.locationparent_ID;
    }
    response.locations.push(response.location);
    return (response);
  }

}
