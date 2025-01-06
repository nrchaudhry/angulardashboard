import { Injectable } from "@angular/core";
import { HttpCallServieService } from "src/app/services/http-call-servie.service";
import { setting } from "src/app/setting";

@Injectable({
  providedIn: "root"
})
export class ReferencepersonService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService
  ) { }


  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"referenceperson",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"referenceperson/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"referenceperson/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"referenceperson",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"referenceperson/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data: any) {
    var postData = {
      request_TYPE: 'PUT',
      request_URI: 'referenceperson',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"referenceperson/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"referenceperson/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"referenceperson/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"referenceperson/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"referenceperson/advancedsearch/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }
  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {

      response[a].person = JSON.parse(response[a].person_DETAIL);
      response[a].person_DETAIL = null;

      response[a].address = response[a].ra_LINE1;
      if (response[a].ra_LINE2 != null && response[a].ra_LINE2 != '')
        response[a].address = response[a].address + ", " + response[a].ra_LINE2;
      if (response[a].ra_LINE3 != null && response[a].ra_LINE3 != '')
        response[a].address = response[a].address + ", " + response[a].ra_LINE3;
      if (response[a].ra_LINE4 != null && response[a].ra_LINE4 != '')
        response[a].address = response[a].address + ", " + response[a].ra_LINE4;
      if (response[a].ra_LINE5 != null && response[a].address_LINE5 != '')
        response[a].address = response[a].address + ", " + response[a].ra_LINE5;

      response[a].location = JSON.parse(response[a].location_DETAIL);
      response[a].location_DETAIL = null;
      while (response[a].location.locationparent_ID != null) {
        response[a].address = response[a].address + ", " + response[a].location.location_NAME;
        response[a].location = response[a].location.locationparent_ID;
      }

    }
    return (response);
  }

  getDetail(response) {

    response.person = JSON.parse(response.person_DETAIL);
    response.person_DETAIL = null;

    response.address = response.ra_LINE1;
    if (response.ra_LINE2 != null && response.ra_LINE2 != '')
      response.address = response.address + ", " + response.ra_LINE2;
    if (response.ra_LINE3 != null && response.ra_LINE3 != '')
      response.address = response.address + ", " + response.ra_LINE3;
    if (response.ra_LINE4 != null && response.ra_LINE4 != '')
      response.address = response.address + ", " + response.ra_LINE4;
    if (response.ra_LINE5 != null && response.ra_LINE5 != '')
      response.address = response.address + ", " + response.ra_LINE5;

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
