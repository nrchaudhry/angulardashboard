import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonComponent } from '../../../components/person/person/person.component';

declare var $: any;

@Component({
  selector: 'app-personview',
  templateUrl: './personview.component.html',
  styleUrls: ['./personview.component.css']
})
export class PersonviewComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;

  personID = 0;
  title = "Person";
  person_ID;

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  disabled = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.person) {
        this.personID = params.person;
      }
    });
  }
  next() {
    this.router.navigate(['/home/contact'], { queryParams: { person: this.person_ID } });
  }
}
