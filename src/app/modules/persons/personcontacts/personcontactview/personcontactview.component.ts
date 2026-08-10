import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersoncontactComponent } from 'src/app/components/person/personcontact/personcontact.component';

@Component({
  selector: 'app-personcontactview',
  templateUrl: './personcontactview.component.html',
  styleUrls: ['./personcontactview.component.css']
})
export class PersoncontactviewComponent implements OnInit {
  @ViewChild("personcontact") personcontact: PersoncontactComponent;

  personcontactID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personcontact) {
        this.personcontactID = params.personcontact;
      }
    });
  }

  refresh() {
    this.personcontact.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/personal"], { queryParams: {} });
  }
}
