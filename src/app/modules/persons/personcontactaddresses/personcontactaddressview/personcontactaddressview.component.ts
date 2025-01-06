import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersoncontactaddressComponent } from 'src/app/components/person/personcontactaddress/personcontactaddress.component';

@Component({
  selector: 'app-personcontactaddressview',
  templateUrl: './personcontactaddressview.component.html',
  styleUrls: ['./personcontactaddressview.component.css']
})
export class PersoncontactaddressviewComponent implements OnInit {
  @ViewChild("personcontactaddress") personcontactaddress: PersoncontactaddressComponent;

  personcontactaddressID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personcontactaddress) {
        this.personcontactaddressID = params.personcontactaddress;
      }
    });
  }

  refresh() {
    this.personcontactaddress.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/personal"], { queryParams: {} });
  }
}
