import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { setting } from '../../../setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';

import { PersonComponent } from '../../person/person/person.component';
import { CompanyComponent } from '../../company/company/company.component';
import { EmployeeService } from './employee.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild("grid") dataGrid: DxDataGridComponent;

  @ViewChild("person") person: PersonComponent;
  @ViewChild("company") company: CompanyComponent;

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
  employeeID = null;
  @Input()
  personID = null;
  @Input()
  companyID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onEmployeeChange = new EventEmitter();

  titles = [];
  employees = [];
  employeesAll = [];
  employee = {
    employee_ID: 0,
    employee_NO: null,
    title: null,
    forenames: null,
    surname: null,
    person_ID: 0,
    company_ID: 0,
    issalerep: false,
    isactive: true,
  }

  constructor(
    private employeeservice: EmployeeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.employeeservice.getTitle().subscribe(res => {
      if (res) {
        this.titles = res;
      }
    }, error => {
      return;
    });
    this.load(this.isreload);
  }

  load(reload) {
    this.employees = JSON.parse(window.sessionStorage.getItem('employees'));
    this.employeesAll = JSON.parse(window.sessionStorage.getItem('employeesAll'));

    if (this.employeeID != 0 && !this.employeeID && Number(window.sessionStorage.getItem('employee')) > 0) {
      this.employeeID = Number(window.sessionStorage.getItem('employee'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.employees == null || this.employees.length == 0 || reload == true)) {
      this.employees = null;
      this.employeeGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.employeesAll == null || this.employeesAll.length == 0 || reload == true)) {
      this.employeesAll = null;
      this.employeeGetAll();
    }

    var search = {
      person_ID: this.personID,
      company_ID: this.companyID,
    }

    if (this.view >= 5 && this.view <= 6 && this.employeeID) {
      window.sessionStorage.setItem("employee", this.employeeID);
      this.employeeGetOne(this.employeeID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.employees == null || this.employees.length == 0 || reload == true)) {
      this.employees = null;
      this.employeeAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.employeesAll == null || this.employeesAll.length == 0 || reload == true)) {
      this.employeesAll = null;
      this.employeeAdvancedSearchAll(search);
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
    this.employee = {
      employee_ID: 0,
      employee_NO: null,
      title: null,
      forenames: null,
      surname: null,
      person_ID: 0,
      company_ID: 0,
      issalerep: false,
      isactive: true,
    }
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

  employeeEdit() {
    this.disabled = false;
  }

  employeeCancel() {
    this.disabled = true;
    if (this.employee.employee_ID == 0) {
      this.router.navigate(["/home/employees"], {});
    }
  }

  onChange(employeeID) {
    for (var i = 0; i < this.employeesAll.length; i++) {
      if (this.employeesAll[i].employee_ID == employeeID) {
        this.onEmployeeChange.next(this.employeesAll[i]);
        break;
      }
    }
  }

  setEmployee(response) {
    this.employeeID = response.employee_ID;
    this.personID = response.person_ID;
    this.companyID = response.company_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    if (response.issalerep == "Y") {
      response.issalerep = true;
    } else {
      response.issalerep = false;
    }
    this.employee = response;
  }

  setEmployees(response) {
    this.cancel.next();
    return response;
  }

  employeeGet() {
    this.employeeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.employees = this.setEmployees(this.employeeservice.getAllDetail(response));
          window.sessionStorage.setItem("employees", JSON.stringify(this.employees));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeGetAll() {
    this.employeeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.employeesAll = this.setEmployees(this.employeeservice.getAllDetail(response));
          window.sessionStorage.setItem("employeesAll", JSON.stringify(this.employeesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeGetOne(id) {
    this.disabled = true;
    this.employeeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setEmployee(this.employeeservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeAdd(employee) {
    if (employee.issalerep == true) {
      employee.issalerep = "Y";
    } else {
      employee.issalerep = "N";
    }
    employee.isactive = "Y";

    this.employeeservice.add(employee).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.employee_ID) {
          this.toastrservice.success("Success", "New Employee Added");
          this.setEmployee(this.employeeservice.getDetail(response));
          this.refresh.next();
          this.employeeGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeUpdate(employee) {
    if (employee.issalerep == true) {
      employee.issalerep = "Y";
    } else {
      employee.issalerep = "N";
    }
    if (employee.isactive == true) {
      employee.isactive = "Y";
    } else {
      employee.isactive = "N";
    }

    this.employeeservice.update(employee, employee.employee_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.employee_ID) {
          this.toastrservice.success("Success", "Employee Updated");
          this.setEmployee(this.employeeservice.getDetail(response));
          this.refresh.next();
          this.employeeGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeUpdateAll(employees) {
    this.employeeservice.updateAll(employees).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Employee Updated");
          this.setEmployee(this.employeeservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeSearch(str) {
    var search = {
      search: str
    }
    this.employeeservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.employees = this.setEmployees(this.employeeservice.getAllDetail(response));
          window.sessionStorage.setItem("employees", JSON.stringify(this.employees));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeSearchAll(str) {
    var search = {
      search: str
    }
    this.employeeservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.employeesAll = this.setEmployees(this.employeeservice.getAllDetail(response));
          window.sessionStorage.setItem("employeesAll", JSON.stringify(this.employeesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeAdvancedSearch(search) {
    this.personID = search.person_ID;
    this.companyID = search.company_ID;
    this.employeeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.employees = this.setEmployees(this.employeeservice.getAllDetail(response));
          window.sessionStorage.setItem("employees", JSON.stringify(this.employees));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeeAdvancedSearchAll(search) {
    this.personID = search.person_ID;
    this.companyID = search.company_ID;
    this.employeeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.employeesAll = this.setEmployees(this.employeeservice.getAllDetail(response));
          window.sessionStorage.setItem("employeesAll", JSON.stringify(this.employeesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
