import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";
import { PersonService } from "../person/person.service";


@Injectable({
  providedIn: 'root'
})
export class PersoncontactaddressService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice: PersonService
  ) { }


  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personcontactaddress",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personcontactaddress/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personcontactaddress/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcontactaddress",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personcontactaddress/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personcontactaddress",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"personcontactaddress/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcontactaddress/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcontactaddress/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcontactaddress/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcontactaddress/advancedsearch/all",
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
    // while (response.location.locationparent_ID != null) {
    //   response.address = response.address + ", " + response.location.location_NAME;
    //   response.locations.push(response.location);
    //   response.location = response.location.locationparent_ID;
    // }
    response.locations.push(response.location);
    return (response);
  }
}
