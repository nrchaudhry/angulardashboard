import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from 'src/app/setting';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private _HttpCallServieService_: HttpCallServieService) {}

  get() {
    var postData = {
      request_TYPE: 'GET',
      request_URI: 'person',
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: 'GET',
      request_URI: 'person/all',
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  getOne(id: string) {
    var postData = {
      request_TYPE: 'GET',
      request_URI: 'person/' + id,
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  add(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: 'person',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  update(data: any, id: string) {
    var postData = {
      request_TYPE: 'PUT',
      request_URI: 'person/' + id,
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data: any) {
    var postData = {
      request_TYPE: 'PUT',
      request_URI: 'person',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  delete(id: string) {
    var postData = {
      request_TYPE: 'DELETE',
      request_URI: 'person/' + id,
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  search(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: 'person/search',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: 'person/search/all',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: 'person/advancedsearch',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: 'person/advancedsearch/all',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

 
  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetail(response[a]);
    }
    return (response);
  }
  
  getDetail(response) {
  if (response.birthplace_DETAIL != null) {
    response.birthplaces = [];
    response.location = JSON.parse(response.birthplace_DETAIL);
    response.birthplace_DETAIL = null;
    while (response.location.locationparent_ID != null) {
      response.birthplaces.push(response.location);
      response.location = response.location.locationparent_ID;
    }
    response.birthplaces.push(response.location);
  }
  return(response);
}
}
