import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from 'src/app/setting';
import { PersonService } from '../person/person.service';

@Injectable({
  providedIn: 'root'
})
export class PersoncommunicationletterService{
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private personservice:PersonService
  ) { }

  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personcommunicationletter",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personcommunicationletter/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"personcommunicationletter/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcommunicationletter",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"personcommunicationletter/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data: any) {
    var postData = {
      request_TYPE: 'PUT',
      request_URI: 'personcommunicationletter',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"personcommunicationletter/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcommunicationletter/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcommunicationletter/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcommunicationletter/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"personcommunicationletter/advancedsearch/all",
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

    return(response);
  }
}

