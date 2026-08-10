import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { setting } from 'src/app/setting';
import { redirectByHref } from '../../lookup/../../utilities/Shared_Funtions';

import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';



import { DisabilityComponent } from '../../lookup/person/disability/disability.component';
import { EthnicComponent } from '../../lookup/person/ethnic/ethnic.component';
import { GenderComponent } from '../../lookup/person/gender/gender.component';
import { ImmigrationstatusComponent } from '../../lookup/person/immigrationstatus/immigrationstatus.component';
import { MaritalstatusComponent } from '../../lookup/person/maritalstatus/maritalstatus.component';
import { ReligionComponent } from '../../lookup/person/religion/religion.component';
import { SexComponent } from '../../lookup/person/sex/sex.component';
import { SexualorientationComponent } from '../../lookup/person/sexualorientation/sexualorientation.component';
import { PersonequalityService } from './personequality.service';

@Component({
  selector: 'app-personequality',
  templateUrl: './personequality.component.html',
  styleUrls: ['./personequality.component.css']
})
export class PersonequalityComponent implements OnInit {
  @ViewChild("residential") residential: LocationsearchfilterComponent;
  @ViewChild("domicile") domicile: LocationsearchfilterComponent;
  @ViewChild("nationality") nationality: LocationsearchfilterComponent;

  @ViewChild("maritalstatus") maritalstatus: MaritalstatusComponent;
  @ViewChild("religion") religion: ReligionComponent;
  @ViewChild("ethnic") ethnic: EthnicComponent;

  @ViewChild("gender") gender: GenderComponent;
  @ViewChild("sex") sex: SexComponent;
  @ViewChild("sexualorientation") sexualorientation: SexualorientationComponent;

  @ViewChild("disability") disability: DisabilityComponent;
  @ViewChild("immigrationstatus") immigrationstatus: ImmigrationstatusComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;

  @Input()
  personID = null;
  @Input()
  personDisabled: boolean = true;
  @Input()
  personequalityID = null;

  @Input()
  nationalityID = null;
  @Input()
  nationalityCode = null;
  @Input()
  nationalityDisabled: boolean = true;
  @Input()
  nationalityHidden: boolean = false;

  @Input()
  residentialID = null;
  @Input()
  residentialCode = null;
  @Input()
  residentialDisabled: boolean = true;
  @Input()
  residentialHidden: boolean = false;

  @Input()
  domicileID = null;
  @Input()
  domicileCode = null;
  @Input()
  domicileDisabled: boolean = true;
  @Input()
  domicileHidden: boolean = false;

  @Input()
  maritalstatusID = null;
  @Input()
  maritalstatusCode = null;
  @Input()
  maritalstatusDisabled: boolean = true;
  @Input()
  maritalstatusHidden: boolean = false;

  @Input()
  ethnicID = null;
  @Input()
  ethnicCode = null;
  @Input()
  ethnicDisabled: boolean = true;
  @Input()
  ethnicHidden: boolean = false;

  @Input()
  religionID = null;
  @Input()
  religionCode = null;
  @Input()
  religionDisabled: boolean = true;
  @Input()
  religionHidden: boolean = false;

  @Input()
  disableID = null;
  @Input()
  disableCode = null;

  @Input()
  genderID = null;
  @Input()
  genderCode = null;
  @Input()
  genderDisabled: boolean = true;
  @Input()
  genderHidden: boolean = false;

  @Input()
  sexualorientationID = null;
  @Input()
  sexualorientationCode = null;
  @Input()
  sexualorientationDisabled: boolean = true;
  @Input()
  sexualorientationHidden: boolean = false;

  @Input()
  immigrationstatusID = null;
  @Input()
  immigrationstatusCode = null;
  @Input()
  immigrationstatusDisabled: boolean = true;
  @Input()
  immigrationstatusHidden: boolean = false;
  
  @Input()
  armedforcesindicatorID = null;
  @Input()
  armedforcesindicatorCode = null;
  @Input()
  armedforcesindicatorDisabled: boolean = true;
  @Input()
  armedforcesindicatorHidden: boolean = false;

  @Input()
  lookedafterchildindicatorID = null;
  @Input()
  lookedafterchildindicatorCode = null;
  @Input()
  lookedafterchildindicatorDisabled: boolean = true;
  @Input()
  lookedafterchildindicatorHidden: boolean = false;

  @Input()
  sexID = null;
  @Input()
  sexCode = null;
  @Input()
  sexDisabled: boolean = true;
  @Input()
  sexHidden: boolean = false;
  
  @Input()
  UKentryDisabled: boolean = true;
  @Input()
  UKentryHidden: boolean = false;

  @Input()
  convictionDisabled: boolean = true;
  @Input()
  convictionHidden: boolean = false;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onpersonequalityChange = new EventEmitter();


  personequalities = [];
  personequalitiesAll = [];
  personequality = {
    personequality_ID: 0,
    person_ID: null,
    person_DETAIL: null,

    nationality_ID: null,
    residential_ID: null,
    domicile_ID: null,
    nationalities: [],
    residentials: [],
    domiciles: [],

    maritalstatus_ID: null,
    ethnic_ID: null,
    religion_ID: null,
    disable_ID: null,

    gender_ID: null,
    sex_ID: null,
    sex_DESC: null,

    sexualorientation_ID: null,
    sexualorientation_DESC: null,

    immigrationstatus_ID: null,
    immigrationstatus_DESC: null,
    date_OF_UK_ENTRY: null,

    armedforcesindicator_ID: null,
    armedforcesindicator_DESC: null,
    lookedafterchildindicator_ID: null,

    convictiondetails: null,

    iscriminalconviction: true,
    issmoker: true,
    isactive: true
  }

  constructor(
    private personequalitieservice: PersonequalityService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (!this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    } else {
      redirectByHref(setting.redirctPath + "/#/home/personal");
    }

    if (window.sessionStorage.getItem('personequalities') != null) {
      this.personequalities = JSON.parse(window.sessionStorage.getItem('personequalities'));
    }
    if (window.sessionStorage.getItem('personequalitiesAll') != null) {
      this.personequalitiesAll = JSON.parse(window.sessionStorage.getItem('personequalitiesAll'));
    }
    if (this.personequalityID != 0 && !this.personequalityID && Number(window.sessionStorage.getItem('personequality')) > 0) {
      this.personequalityID = Number(window.sessionStorage.getItem('personequality'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personequalities == null || this.personequalities.length == 0 || reload == true)) {
      this.personequalities == null;
      this.personequalityGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personequalitiesAll == null || this.personequalitiesAll.length == 0 || reload == true)) {
      this.personequalitiesAll == null;
      this.personequalityGetAll();
    }

    var search = {
      person_ID: this.personID,
      nationality_ID: this.nationalityID,
      domicile_ID: this.domicileID,
      maritalstatus_ID: this.maritalstatusID,
      religion_ID: this.religionID,
      ethnic_ID: this.ethnicID,
      gender_ID: this.genderID,
      sex_ID: this.sexID,
      sexualorientation_ID: this.sexualorientationID,
      disability_ID: this.disableID,
      immigrationstatus_ID: this.immigrationstatusID,
      nationality_CODE: this.nationalityCode,
      residential_CODE: this.residentialCode,
      domicile_CODE: this.domicileCode,
      maritalstatus_CODE: this.maritalstatusCode,
      religion_CODE: this.religionCode,
      ethnic_CODE: this.ethnicCode,
      gender_CODE: this.genderCode,
      sex_CODE: this.sexCode,
      sexualorientation_CODE: this.sexualorientationCode,

      disability_CODE: this.disableCode,
      immigrationstatus_CODE: this.immigrationstatusCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.personequalityID) {
      window.sessionStorage.setItem("personequality", this.personequalityID);
      this.personequalityGetOne(this.personequalityID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personequalities == null || this.personequalities.length == 0 || reload == true)) {
      this.personequalities == null;
      this.personequalityAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personequalitiesAll == null || this.personequalitiesAll.length == 0 || reload == true)) {
      this.personequalitiesAll == null;
      this.personequalityAdvancedSearchAll(search);
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.load.bind(this, true),
        },
      }
    );
  }

  add() {
    this.personequality = {
      personequality_ID: 0,
      person_ID: 0,
      person_DETAIL: null,

      nationality_ID: null,
      residential_ID: null,
      domicile_ID: null,
      nationalities: [],
      residentials: [],
      domiciles: [],

      maritalstatus_ID: {
        id: null,
        entity_STATUS: null
      },
      ethnic_ID: {
        id: null,
        entity_STATUS: null
      },
      religion_ID: {
        id: null,
        entity_STATUS: null
      },
      disable_ID: {
        id: null,
        entity_STATUS: null
      },

      gender_ID: {
        id: null,
        entity_STATUS: null
      },
      sex_ID: {
        id: null,
        entity_STATUS: null
      },
      sex_DESC: null,

      sexualorientation_ID: {
        id: null,
        entity_STATUS: null
      },
      sexualorientation_DESC: null,

      immigrationstatus_ID: {
        id: null,
        entity_STATUS: null
      },
      immigrationstatus_DESC: null,
      date_OF_UK_ENTRY: null,

      armedforcesindicator_ID: {
        id: null,
        entity_STATUS: null
      },
      armedforcesindicator_DESC: null,
      lookedafterchildindicator_ID: {
        id: null,
        entity_STATUS: null
      },

      convictiondetails: null,

      iscriminalconviction: true,
      issmoker: true,
      isactive: true
    };
  }

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  personequalityEdit() {
    this.disabled = false;
  }

  personequalityCancel() {
    this.disabled = true;
    this.personequalityAdvancedSearch(this.personID);
  }

  onChange(personequalityID) {
    for (var i = 0; i < this.personequalitiesAll.length; i++) {
      if (this.personequalitiesAll[i].personequality_ID == personequalityID) {
        this.onpersonequalityChange.next(this.personequalitiesAll[i]);
        break;
      }
    }
  }

  setPersonequality(response) {
    this.personequalityID = response.personequality_ID;
    this.personID = response.person_ID;
    this.nationalityID = response.nationality_ID;
    this.residentialID = response.residential_ID;
    this.domicileID = response.domicile_ID;
    this.nationalityID = response.nationality_ID;
    this.residentialID = response.residential_ID;
    this.ethnicID = response.ethnic_ID;
    this.maritalstatusID = response.maritalstatus_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personequality = response;
    this.disabled = true;
  }


  setPersonequalities(response) {
    this.cancel.next();
    return response;
  }

  personequalityGet() {
    this.personequalitieservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personequalities = this.setPersonequalities(this.personequalitieservice.getAllDetail(response));
          window.sessionStorage.setItem("personequalities", JSON.stringify(this.personequalities));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityGetAll() {
    this.personequalitieservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personequalitiesAll = this.setPersonequalities(this.personequalitieservice.getAllDetail(response));
          window.sessionStorage.setItem("personequalitiesAll", JSON.stringify(this.personequalitiesAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityGetOne(id) {
    this.personequalitieservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonequality(this.personequalitieservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityAdd(personequality) {
    personequality.person_ID = this.personID;
    personequality.nationality_ID = this.nationality.locationID;
    personequality.residential_ID = this.residential.locationID;
    personequality.domicile_ID = this.domicile.locationID;

    personequality.maritalstatus_ID = this.maritalstatus.maritalstatusID;
    personequality.religion_ID = this.religion.religionID;
    personequality.ethnic_ID = this.ethnic.ethnicID;

    personequality.gender_ID = this.gender.genderID;
    personequality.sex_ID = this.sex.sexID;
    personequality.sexualorientation_ID = this.sexualorientation.sexualorientationID;

    personequality.disable_ID = this.disability.disabilityID;
    personequality.immigrationstatus_ID = this.immigrationstatus.immigrationstatusID;
    personequality.isactive = "Y";

    this.personequalitieservice.add(personequality).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personequality_ID) {
          this.toastrservice.success("Success", "New Personequality Added");
          this.personequalityGetAll();
          this.setPersonequality(this.personequalitieservice.getDetail(response));
          this.refresh.next();
          this.personequalityGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityUpdate(personequality) {
    personequality.person_ID = this.personID;
    personequality.nationality_ID = this.nationality.locationID;
    personequality.residential_ID = this.residential.locationID;
    personequality.domicile_ID = this.domicile.locationID;

    personequality.maritalstatus_ID = this.maritalstatus.maritalstatusID;
    personequality.religion_ID = this.religion.religionID;
    personequality.ethnic_ID = this.ethnic.ethnicID;

    personequality.gender_ID = this.gender.genderID;
    personequality.sex_ID = this.sex.sexID;
    personequality.sexualorientation_ID = this.sexualorientation.sexualorientationID;

    personequality.disable_ID = this.disability.disabilityID;
    personequality.immigrationstatus_ID = this.immigrationstatus.immigrationstatusID;
    if (personequality.isactive == true) {
      personequality.isactive = "Y";
    } else {
      personequality.isactive = "N";
    }
    this.personequalitieservice.update(personequality, personequality.personequality_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personequality_ID) {
          this.toastrservice.success("Success", " Personequality Updated");
          this.setPersonequality(this.personequalitieservice.getDetail(response));
          this.refresh.next();
          this.personequalityGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityUpdateAll(personequalities) {
    this.personequalitieservice.updateAll(personequalities).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Modules Updated");
          this.setPersonequality(this.personequalitieservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalitySearch(str) {
    var search = {
      search: str
    }
    this.personequalitieservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personequalities = this.setPersonequalities(this.personequalitieservice.getAllDetail(response));
          window.sessionStorage.setItem("personequalities", JSON.stringify(this.personequalities));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalitySearchAll(str) {
    var search = {
      search: str
    }
    this.personequalitieservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personequalitiesAll = this.setPersonequalities(this.personequalitieservice.getAllDetail(response));
          window.sessionStorage.setItem("personequalitiesAll", JSON.stringify(this.personequalitiesAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityAdvancedSearch(search) {
    this.personID = search.person_ID;
    this.nationalityID = search.nationality_ID,
      this.residentialID = search.residential_ID,
      this.domicileID = search.domicile_ID,
      this.maritalstatusID = search.maritalstatus_ID,
      this.religionID = search.religion_ID,
      this.ethnicID = search.ethnic_ID,
      this.genderID = search.gender_ID,
      this.sexID = search.sex_ID,
      this.sexualorientationID = search.sexualorientation_ID;
    this.disableID = search.disability_ID;
    this.immigrationstatusID = search.immigrationstatus_ID;
    this.nationalityCode = search.nationality_CODE,
      this.residentialCode = search.residential_CODE,
      this.domicileCode = search.domicile_CODE,
      this.maritalstatusCode = search.maritalstatus_CODE,
      this.religionCode = search.religion_CODE,
      this.ethnicCode = search.ethnic_CODE,
      this.genderCode = search.gender_CODE,
      this.sexCode = search.sex_CODE,
      this.sexualorientationCode = search.sexualorientation_CODE;

    this.disableCode = search.disability_CODE;
    this.immigrationstatusCode = search.immigrationstatus_CODE;

    this.personequalitieservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personequalities = response;
          if (this.personequalities.length > 0) {
            this.setPersonequality(this.personequalitieservice.getDetail(this.personequalities[0]));
            this.nationality.setLocation(this.personequality.nationalities);
            this.residential.setLocation(this.personequality.residentials);
            this.domicile.setLocation(this.personequality.domiciles);
          } else
            this.add();
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personequalityAdvancedSearchAll(search) {
    this.personID = search.person_ID;
    this.nationalityID = search.nationality_ID,
      this.residentialID = search.residential_ID,
      this.domicileID = search.domicile_ID,
      this.maritalstatusID = search.maritalstatus_ID,
      this.religionID = search.religion_ID,
      this.ethnicID = search.ethnic_ID,
      this.genderID = search.gender_ID,
      this.sexID = search.sex_ID,
      this.sexualorientationID = search.sexualorientation_ID;
    this.disableID = search.disability_ID;
    this.immigrationstatusID = search.immigrationstatus_ID;
    this.nationalityCode = search.nationality_CODE,
      this.residentialCode = search.residential_CODE,
      this.domicileCode = search.domicile_CODE,
      this.maritalstatusCode = search.maritalstatus_CODE,
      this.religionCode = search.religion_CODE,
      this.ethnicCode = search.ethnic_CODE,
      this.genderCode = search.gender_CODE,
      this.sexCode = search.sex_CODE,
      this.sexualorientationCode = search.sexualorientation_CODE;

    this.disableCode = search.disability_CODE;
    this.immigrationstatusCode = search.immigrationstatus_CODE;


    this.personequalitieservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonequalities(this.personequalitieservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}