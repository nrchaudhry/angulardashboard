import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { GetaddressService } from '../../../services/getaddress.service';

import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;

  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  locationID;
  @Input()
  addressPostCode = null;
  @Input()
  addressLine1 = null;
  @Input()
  addressLine2 = null;
  @Input()
  addressLine3 = null;
  @Input()
  addressLine4 = null;
  @Input()
  addressLine5 = null;
  @Input()
  addressLatitude = null;
  @Input()
  addressLongitude = null;
  @Input()
  telephoneNumber = null;
  @Input()
  telephoneAltNumber = null;
  @Input()
  mobileNumber = null;
  @Input()
  email = null;
  @Input()
  webAddress = null;

  addressActive = [];
  response = {
    postcode: ''
  };

  constructor(
    private getaddressservice: GetaddressService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
}

  updateAddress(event) {
//    this.locationID = event.country
    this.addressLine1 = event.line_1;
    this.addressLine2 = event.line_2;
    this.addressLine3 = event.line_3;
    this.addressLine4 = event.line_4;
    this.addressLine5 = event.line_5;
    this.addressPostCode = this.response.postcode;
  }

  getAddress(postcode) {
    this.getaddressservice.getByPostcode(postcode).subscribe(response => {
      if (response) {
        this.response = response;
        this.addressActive = response["addresses"];
        for (var a = 0; a < this.addressActive.length; a++) {
          this.addressActive[a].mainaddress = this.addressActive[a].line_1 + " " + this.addressActive[a].county;
        }

      } else {
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
