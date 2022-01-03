import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';

import { UniversityService } from '../../../services/academics/university.service';
import { CollegeService } from '../../../services/academics/college.service';
import { DepartmentService } from './department.service';

declare var $: any;

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  universityActive = [];
  collegeActive = [];
  departmentAll = [];
  department = {
    department_ID: 0,
    university_ID: null,
    college_ID: null,
    department_CODE: null,
    department_NAME: null,
    department_DESCRIPTION: null,
    isactive: true
  }

  constructor(
    private departmentservice: DepartmentService,
    private universityservice: UniversityService,
    private collegeservice: CollegeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  view() {
  }

  addNew() {
    this.department = {
      department_ID: 0,
      university_ID: null,
      college_ID: null,
      department_NAME: null,
      department_CODE: null,
      department_DESCRIPTION: null,
      isactive: true
    };
    this.universityGet();

    $("#adddepartment").modal("show");
  }

  cancel() {
    $("#adddepartment").modal("hide");
    $("#editdepartment").modal("hide");  
  }

  edit(row) {
    this.department = {
      department_ID: row.data.department_ID,
      university_ID: row.data.college_ID.university_ID.university_ID,
      college_ID: row.data.college_ID.college_ID,
      department_NAME: row.data.department_NAME,
      department_CODE: row.data.department_CODE,
      department_DESCRIPTION: row.data.department_DESCRIPTION,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.department.isactive = true;
    } else {
      this.department.isactive = false;
    }
    this.universityGetAll();

    $("#editdepartment").modal("show");  
  }

  universityOnChange(universityID) {
    var search = {
      university_ID: universityID
    }
    if (this.department.department_ID==0) {
      this.collegeAdvancedSearch(search);
    } else {
      this.collegeAdvancedSearchAll(search);
    }
  }

  // APIs Call Functions

  getAll() {
    this.departmentservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.departmentAll = response;
          this.cancel();
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  add(department) {
    this.departmentservice.add(department).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.department_ID) {
          this.toastrservice.success("Success", "New Department Added");
          this.getAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  update(department) {
    if (department.isactive == true) {
      department.isactive = "Y";
    } else {
      department.isactive = "N";
    }
    this.departmentservice.update(department, department.department_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.department_ID) {
          this.toastrservice.success("Success", " Department Updated");
          this.department = response;
          this.getAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
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
            this.department.university_ID = this.universityActive[0].university_ID;
          }
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
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
            this.department.university_ID = this.universityActive[0].university_ID;
            this.universityOnChange(this.department.university_ID);
          }
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  collegeAdvancedSearchAll(search){
    this.collegeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.collegeActive = response;
          if (this.collegeActive.length==1) {
            this.department.college_ID = this.collegeActive[0].college_ID;
            this.universityOnChange(this.department.university_ID);
          }
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  collegeAdvancedSearch(search){
    this.collegeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.collegeActive = response;
          if (this.collegeActive.length==1) {
            this.department.college_ID = this.collegeActive[0].college_ID;
          }
        }
      } else {
        this.toastrservice.error("Some thing went wrong");
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}

