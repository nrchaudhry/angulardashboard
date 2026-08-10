import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

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
      request_URI: setting.commonServicePath+'person',
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  getAll() {
    var postData = {
      request_TYPE: 'GET',
      request_URI: setting.commonServicePath+'person/all',
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  getOne(id: string) {
    var postData = {
      request_TYPE: 'GET',
      request_URI: setting.commonServicePath+'person/' + id,
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  add(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: setting.commonServicePath+'person',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  update(data: any, id: string) {
    var postData = {
      request_TYPE: 'PUT',
      request_URI: setting.commonServicePath+'person/' + id,
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  updateAll(data: any) {
    var postData = {
      request_TYPE: 'PUT',
      request_URI: setting.commonServicePath+'person',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  delete(id: string) {
    var postData = {
      request_TYPE: 'DELETE',
      request_URI: setting.commonServicePath+'person/' + id,
      request_BODY: '',
    };
    return this._HttpCallServieService_.api(postData);
  }

  search(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: setting.commonServicePath+'person/search',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  searchAll(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: setting.commonServicePath+'person/search/all',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearch(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: setting.commonServicePath+'person/advancedsearch',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  advancedSearchAll(data: any) {
    var postData = {
      request_TYPE: 'POST',
      request_URI: setting.commonServicePath+'person/advancedsearch/all',
      request_BODY: JSON.stringify(data),
    };
    return this._HttpCallServieService_.api(postData);
  }

  upload(file):Observable<any> {
    return this._HttpCallServieService_.upload(file);
  }
 
  getAllDetail(response) {
    for (var a = 0; a < response.length; a++) {
      response[a] = this.getDetails(response[a]);
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

    response.contactaddresses = [];
    response.contacts = [];
    response.emails = "";
    response.numbers = "";

    if (response.personcontactaddresses != null) {
      response.personcontactaddresses = JSON.parse(response.personcontactaddresses);
      var addresses = "";
      for (var a = 0; a < response.personcontactaddresses.length; a++) {
        var contactaddress = response.personcontactaddresses[a];
        contactaddress.address = contactaddress.address_LINE1;
        if (contactaddress.address_LINE2 != null && contactaddress.address_LINE2 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE2;
        if (contactaddress.address_LINE3 != null && contactaddress.address_LINE3 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE3;
        if (contactaddress.address_LINE4 != null && contactaddress.address_LINE4 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE4;
        if (contactaddress.address_LINE5 != null && contactaddress.address_LINE5 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE5;
        contactaddress.locations = [];
        contactaddress.location = contactaddress.location_DETAIL;
        contactaddress.location_DETAIL = null;
        // while (contactaddress.location.locationparent_ID != null) {
        //   contactaddress.address = contactaddress.address + ", " + contactaddress.location.location_NAME;
        //   contactaddress.locations.push(contactaddress.location);
        //   contactaddress.location = contactaddress.location.locationparent_ID;
        // }
        contactaddress.locations.push(contactaddress.location);
        response.contactaddresses.push(contactaddress);

        if (addresses == "") {
          addresses = contactaddress.address;
        } else {
          addresses = addresses + "\n\n" + contactaddress.address;
        }
      }

      response.personcontactaddresses = addresses;
    }

    if (response.personcontacts != null) {
      response.personcontacts = JSON.parse(response.personcontacts);
      for (var a = 0; a < response.personcontacts.length; a++) {
        var contact = response.personcontacts[a];
        if (contact.contacttype_DETAIL != null) {
          contact.contacttype = JSON.parse(contact.contacttype_DETAIL);
          contact.contacttype_DETAIL = contact.contacttype.code + ' - ' + contact.contacttype.description;

          response.contacts.push(contact);
          if (contact.contacttype.code == "E") {
            if (response.emails == "") {
              response.emails = contact.contact_VALUE;
            } else {
              response.emails = response.emails + ", " + contact.contact_VALUE;
            }
          } else {
            if (response.numbers == "") {
              response.numbers = contact.contact_VALUE;
            } else {
              response.numbers = response.numbers + ", " + contact.contact_VALUE;
            }
          }
        }

      }  
    }

    return(response);
  }

  getDetails(response) {
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

    response.contactaddresses = [];
    response.contacts = [];
    response.emails = "";
    response.numbers = "";

    if (response.personcontactaddresses != null) {
      response.personcontactaddresses = JSON.parse(response.personcontactaddresses);
      var addresses = "";
      for (var a = 0; a < response.personcontactaddresses.length; a++) {
        var contactaddress = JSON.parse(response.personcontactaddresses[a]);
        contactaddress.address = contactaddress.address_LINE1;
        if (contactaddress.address_LINE2 != null && contactaddress.address_LINE2 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE2;
        if (contactaddress.address_LINE3 != null && contactaddress.address_LINE3 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE3;
        if (contactaddress.address_LINE4 != null && contactaddress.address_LINE4 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE4;
        if (contactaddress.address_LINE5 != null && contactaddress.address_LINE5 != '')
          contactaddress.address = contactaddress.address + ", " + contactaddress.address_LINE5;
        contactaddress.locations = [];
        contactaddress.location = contactaddress.location_DETAIL;
        contactaddress.location_DETAIL = null;
        // while (contactaddress.location.locationparent_ID != null) {
        //   contactaddress.address = contactaddress.address + ", " + contactaddress.location.location_NAME;
        //   contactaddress.locations.push(contactaddress.location);
        //   contactaddress.location = contactaddress.location.locationparent_ID;
        // }
        contactaddress.locations.push(contactaddress.location);
        response.contactaddresses.push(contactaddress);

        if (addresses == "") {
          addresses = contactaddress.address;
        } else {
          addresses = addresses + "\n\n" + contactaddress.address;
        }
      }

      response.personcontactaddresses = addresses;
    }

    if (response.personcontacts != null) {
      response.personcontacts = JSON.parse(response.personcontacts);
      for (var a = 0; a < response.personcontacts.length; a++) {
        var contact = JSON.parse(response.personcontacts[a]);
        if (contact.contacttype_DETAIL != null) {
          contact.contacttype = JSON.parse(contact.contacttype_DETAIL);
          contact.contacttype_DETAIL = contact.contacttype.code + ' - ' + contact.contacttype.description;

          response.contacts.push(contact);

          if (contact.contacttype.code == "E") {
            if (response.emails == "") {
              response.emails = contact.contact_VALUE;
            } else {
              response.emails = response.emails + ", " + contact.contact_VALUE;
            }
          } else {
            if (response.numbers == "") {
              response.numbers = contact.contact_VALUE;
            } else {
              response.numbers = response.numbers + ", " + contact.contact_VALUE;
            }
          }
        }

      }  
    }

    return(response);
  }
}
