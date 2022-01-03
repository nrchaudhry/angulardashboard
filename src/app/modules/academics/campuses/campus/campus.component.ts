import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../../services/on-fail.service';
import { LookupService } from '../../../../services/lookup.service';
import { GetaddressService } from '../../../../services/getaddress.service';

import { UniversityService } from '../../../../services/academics/university.service';
import { CampusService } from '../campus.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {
  universityActive = [];
  addresscountryActive = [];
  addressActive = [];
  campusID;
  campus = {
    campus_ID: 0,
    university_ID: null,
    campus_CODE: '',
    campus_NAME: '',
    campus_DESCRIPTION: '',
    address_LINE1: '',
    address_LINE2: '',
    address_LINE3: '',
    address_LINE4: '',
    address_LINE5: '',
    address_POSTCODE: '',
    addresscountry_ID: null,
    email: '',
    faxno: '',
    telephone: '',
    isactive: true
  };  
  disabled = false;

  constructor(
    private campusservice: CampusService,
    private universityservice: UniversityService,
    private getaddressservice: GetaddressService,
    private lookupservice: LookupService,
    private route: ActivatedRoute,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.campus) {
        this.getOne(params.campus);
      }
    });
    this.universityGet();
    this.countryGet();
  }

  edit(){
    this.disabled = false;
  }

  cancel(){
    this.disabled = true;
  }

  setCampus(response) {
    this.campus = response;
    this.campus.university_ID = response.university_ID.university_ID;
    this.campus.addresscountry_ID = response.addresscountry_ID.id;
    this.disabled = true;
    if (response.isactive=="Y") {
      this.campus.isactive = true;
    } else {
      this.campus.isactive = false;
    }
  }

  getOne(id) {
    this.campusservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.campus_ID) {
          this.setCampus(response);
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  add(campus) {
    this.campusservice.add(campus).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.campus_ID) {
          this.toastrservice.success("Success", "New Campus Added");
          this.setCampus(response);
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  update(campus) {
    if (campus.isactive == true) {
      campus.isactive = 'Y';
    } else {
      campus.isactive = 'N';
    }

    this.campusservice.update(campus, campus.campus_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.campus_ID) {
          this.toastrservice.success("Success", "Campus Updated");
          this.setCampus(response);
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  countryGet(){
    this.lookupservice.lookup("COUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.addresscountryActive = response;
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  universityGetAll(){
    this.universityservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.universityActive = response;
          if (this.universityActive.length==1) {
            this.campus.university_ID = this.universityActive[0].university_ID;
          }
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  universityGet(){
    this.universityservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.universityActive = response;
          if (this.universityActive.length==1) {
            this.campus.university_ID = this.universityActive[0].university_ID;
          }
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  updateAddress(event) {
    console.log("H&", event);
    this.campus.address_LINE1 = event.line_1;
    this.campus.address_LINE2 = event.line_2;
    this.campus.address_LINE3 = event.line_3;
    this.campus.address_LINE4 = event.town_or_city;
    this.campus.address_LINE5 = event.country;
  }

  getAddress(postcode) {
    this.getaddressservice.getByPostcode(postcode).subscribe(response => {
      if (response) {
        this.addressActive = response["addresses"];
        for (var a = 0; a < this.addressActive.length; a++) {
          this.addressActive[a].mainaddress = this.addressActive[a].line_1 + " " + this.addressActive[a].town_or_city + " " + this.addressActive[a].county;
        }

      } else {
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
