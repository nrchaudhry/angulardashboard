import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersoncommunicationsmsComponent } from 'src/app/components/person/personcommunicationsms/personcommunicationsms.component';


@Component({
  selector: 'app-smsview',
  templateUrl: './smsview.component.html',
  styleUrls: ['./smsview.component.css']
})
export class SmsviewComponent implements OnInit {
  @ViewChild("personcommunicationsmss") personcommunicationsmss: PersoncommunicationsmsComponent;

  personsmsID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personcommunicationsms) {
        this.personsmsID = params.personcommunicationsms;
      }
    });
  }

  refresh() {
    this.personcommunicationsmss.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/communications"], { queryParams: {} });
  }
}
