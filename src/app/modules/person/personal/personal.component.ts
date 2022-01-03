import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { HttpCallServieService } from '../../../services/http-call-servie.service';
import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

import { PersonService } from '../person.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  birthplaceActive = [];
  person_ID;
  person = {
    person_ID: 0,
    title: '',
    forenames: '',
    surname: '',
    previoussurname: '',
    middlename: '',
    nickname: '',
    birth_DATE: '',
    birth_TIME: '',
    birthplace_ID: null,
    personimg_PATH: '',
    isactive: true
  };  
  titles;
  disabled = false;

  constructor(
    private personservice: PersonService,
    private lookupservice: LookupService,
    private httpcallservieservice: HttpCallServieService,
    private route: ActivatedRoute,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.person_ID = params.person;
    });
    if (!this.person_ID) {
      this.person_ID = Number(window.sessionStorage.getItem('person'));
    }
    if (this.person_ID) {
      window.sessionStorage.setItem("person", this.person_ID);
      this.getOne(this.person_ID);
    }
    this.getTitles();
    this.countryGet();
  }

  edit(){
    this.disabled = false;
  }

  cancel(){
    this.disabled = true;
  }

  setPerson(response) {
    this.person = response;
    this.disabled = true;
    if (response.isactive=="Y") {
      this.person.isactive = true;
    } else {
      this.person.isactive = false;
    }
  }

  getOne(id) {
    this.personservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.person_ID) {
          this.setPerson(response);
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  add(person) {
    this.personservice.add(person).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.person_ID) {
          this.toastrservice.success("Success", "New Person Added");
          this.setPerson(response);
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  update(person) {
    if (person.isactive == true) {
      person.isactive = 'Y';
    } else {
      person.isactive = 'N';
    }

    this.personservice.update(person, person.person_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.person_ID) {
          this.toastrservice.success("Success", "Person Updated");
          this.setPerson(response);
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  getTitles() {
    this.httpcallservieservice.getTitle().subscribe(res => {
      if (res) {
        this.titles = res;
      }
    }, error => {
      return;
    }
    );
  }

  countryGet(){
    this.lookupservice.lookup("COUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.birthplaceActive = response;
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
