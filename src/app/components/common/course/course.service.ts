import { Injectable } from '@angular/core';
import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { setting } from '../../../setting';
import { QualificationService } from '../qualification/qualification.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private _HttpCallServieService_: HttpCallServieService,
    private qualificationservice: QualificationService,
  ) { }

  get() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.servicePath+"course",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.servicePath+"course/all",
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }


  getOne(id) {
    var postData = {
      request_TYPE: "GET",
      request_URI: setting.servicePath+"course/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  add(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.servicePath+"course",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  update(data, id) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.servicePath+"course/" + id,
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data) {
    var postData = {
      request_TYPE: "PUT",
      request_URI: setting.servicePath+"course",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  delete(id) {
    var postData = {
      request_TYPE: "DELETE",
      request_URI: setting.servicePath+"course/" + id,
      request_BODY: ""
    }
    return this._HttpCallServieService_.api(postData);
  }

  search(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.servicePath+"course/search",
      request_BODY: JSON.stringify(data)

    }
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.servicePath+"course/search/all",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.servicePath+"course/advancedsearch",
      request_BODY: JSON.stringify(data)
    }
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data) {
    var postData = {
      request_TYPE: "POST",
      request_URI: setting.servicePath+"course/advancedsearch/all",
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
    if (response.qualification_DETAIL != null) {
      response.qualification = this.qualificationservice.getDetail(JSON.parse(response.qualification_DETAIL));
      response.qualification_DETAIL = null
    }

    if (response.qualificationtype_DETAIL != null) {
      response.qualificationtype = JSON.parse(response.qualificationtype_DETAIL);
      response.qualificationtype_DETAIL = response.qualificationtype.code + ' - ' + response.qualificationtype.description;
    }

    if (response.teachertrainingcourse_DETAIL != null) {
      response.teachertrainingcourse = JSON.parse(response.teachertrainingcourse_DETAIL);
      response.teachertrainingcourse_DETAIL = response.teachertrainingcourse.code + ' - ' + response.teachertrainingcourse.description;
    }

    if (response.regulatorybody_DETAIL != null) {
      response.regulatorybody = JSON.parse(response.regulatorybody_DETAIL);
      response.regulatorybody_DETAIL = response.regulatorybody.code + ' - ' + response.regulatorybody.description;
    }

    if (response.provisiontype_DETAIL != null) {
      response.provisiontype = JSON.parse(response.provisiontype_DETAIL);
      response.provisiontype_DETAIL = response.provisiontype.code + ' - ' + response.provisiontype.description;
    }

    if (response.courseaim_DETAIL != null) {
      response.courseaim = JSON.parse(response.courseaim_DETAIL);
      response.courseaim_DETAIL = response.courseaim.code + ' - ' + response.courseaim.description;
    }

    return (response);
  }

}
