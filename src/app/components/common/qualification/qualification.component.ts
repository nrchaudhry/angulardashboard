import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { QualificationService } from './qualification.service';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit {

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
  universityID = null;
  @Input()
  qualificationID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onQualificationChange = new EventEmitter();

  qualifications = [];
  qualificationsAll = [];
  qualification = {
    qualification_ID: 0,
    qualification_CODE: null,
    qualification_NAME: null,
    qualification_DESCRIPTION: null,
    isactive: true
  }

  constructor(
    private qualificationservice: QualificationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('qualifications') != null) {
      this.qualifications = JSON.parse(window.sessionStorage.getItem('qualifications'));
    }
    if (window.sessionStorage.getItem('qualificationsAll') != null) {
      this.qualificationsAll = JSON.parse(window.sessionStorage.getItem('qualificationsAll'));
    }
    if (this.qualificationID != 0 && !this.qualificationID && Number(window.sessionStorage.getItem('qualification')) > 0) {
      this.qualificationID = Number(window.sessionStorage.getItem('qualification'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.qualifications == null || this.qualifications.length == 0 || reload == true)) {
      this.qualifications == null;
      this.qualificationGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.qualificationsAll == null || this.qualificationsAll.length == 0 || reload == true)) {
      this.qualificationsAll == null;
      this.qualificationGetAll();
    }

    var search = {
      university_ID: this.universityID
    }
    if (this.view >= 5 && this.view <= 6 && this.qualificationID) {
      window.sessionStorage.setItem("qualification", this.qualificationID);
      this.qualificationGetOne(this.qualificationID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.qualifications == null || this.qualifications.length == 0 || reload == true)) {
      this.qualifications == null;
      this.qualificationAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.qualificationsAll == null || this.qualificationsAll.length == 0 || reload == true)) {
      this.qualificationsAll == null;
      this.qualificationAdvancedSearchAll(search);
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
    this.qualification = {
      qualification_ID: 0,
      qualification_CODE: null,
      qualification_NAME: null,
      qualification_DESCRIPTION: null,
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

  qualificationEdit() {
    this.disabled = false;
  }

  qualificationCancel() {
    this.disabled = true;
    if (this.qualification.qualification_ID == 0) {
      this.router.navigate(["/home/qualifications"], {});
    }
  }

  onChange(qualificationID) {
    for (var i = 0; i < this.qualificationsAll.length; i++) {
      if (this.qualificationsAll[i].qualification_ID == qualificationID) {
        this.onQualificationChange.next(this.qualificationsAll[i]);
        break;
      }
    }
  }

  setQualification(response) {
    this.qualificationID = response.qualification_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.qualification = response;
  }

  setQualifications(response) {
    this.cancel.next();
    return response;
  }

  qualificationGet() {
    this.qualificationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.qualifications = this.setQualifications(this.qualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("qualifications", JSON.stringify(this.qualifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationGetAll() {
    this.qualificationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.qualificationsAll = this.setQualifications(this.qualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("qualificationsAll", JSON.stringify(this.qualificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationGetOne(id) {
    this.disabled = true;
    this.qualificationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setQualification(this.qualificationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationAdd(qualification) {
    qualification.isactive = "Y";
    this.qualificationservice.add(qualification).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.qualification_ID) {
          this.toastrservice.success("Success", "New Qualification Added");
          this.setQualification(this.qualificationservice.getDetail(response));
          this.refresh.next();
          this.qualificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationUpdate(qualification) {
    if (qualification.isactive == true) {
      qualification.isactive = "Y";
    } else {
      qualification.isactive = "N";
    }
    this.qualificationservice.update(qualification, qualification.qualification_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.qualification_ID) {
          this.toastrservice.success("Success", "Qualification Updated");
          this.setQualification(this.qualificationservice.getDetail(response));
          this.refresh.next();
          this.qualificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationUpdateAll(qualifications) {
    this.qualificationservice.updateAll(qualifications).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Qualifications Updated");
          this.setQualification(this.qualificationservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationSearch(str) {
    var search = {
      search: str
    }
    this.qualificationservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.qualifications = this.setQualifications(this.qualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("qualifications", JSON.stringify(this.qualifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationSearchAll(str) {
    var search = {
      search: str
    }
    this.qualificationservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.qualificationsAll = this.setQualifications(this.qualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("qualificationsAll", JSON.stringify(this.qualificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationAdvancedSearch(search) {
    this.universityID = search.university_ID;
    this.qualificationservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.qualificationsAll = this.setQualifications(this.qualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("qualifications", JSON.stringify(this.qualifications));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationAdvancedSearchAll(search) {
    this.universityID = search.university_ID;
    this.qualificationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.qualificationsAll = this.setQualifications(this.qualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("qualificationsAll", JSON.stringify(this.qualificationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
