import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { CompanysubtypeService } from '../companysubtype/companysubtype.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private companysubtypeservice: CompanysubtypeService,
  ) { }

  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"company",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"company/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.commonServicePath+"company/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"company",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"company/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.commonServicePath+"company",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.commonServicePath+"company/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"company/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"company/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"company/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.commonServicePath+"company/advancedsearch/all",
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
    if (response.companysubtype_DETAIL != null) {
      response.companysubtype = this.companysubtypeservice.getDetail(JSON.parse(response.companysubtype_DETAIL));
      response.companysubtype_DETAIL = null
    }

    if (response.businessnature_DETAIL != null) {
      response.businessnature = JSON.parse(response.businessnature_DETAIL);
      response.businessnature_DETAIL = response.businessnature.code + ' - ' + response.businessnature.description;
    }

    if (response.companystatus_DETAIL != null) {
      response.companystatus = JSON.parse(response.companystatus_DETAIL);
      response.companystatus_DETAIL = response.companystatus.code + ' - ' + response.companystatus.description;
    }

    if (response.companyparent_DETAIL != null) {
      response.companyparent = JSON.parse(response.companyparent_DETAIL);
      response.companyparent_DETAIL = response.companyparent.code + ' - ' + response.companyparent.description;
    }

    if (response.netsuite_DETAIL != null) {
      response.netsuite = JSON.parse(response.netsuite_DETAIL);
      response.netsuite_DETAIL = response.netsuite.code + ' - ' + response.netsuite.description;
    }

    return (response);
  }

}
