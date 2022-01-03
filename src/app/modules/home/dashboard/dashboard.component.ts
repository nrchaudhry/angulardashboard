import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  application_CODE: any;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.application_CODE = params["applicationcode"];
    });
    if (this.application_CODE==undefined) {
      var code = window.sessionStorage.getItem('applicationcode');
      this.application_CODE = code;
    } else {
      window.sessionStorage.setItem('applicationcode', String(this.application_CODE));
    }
  }

}
