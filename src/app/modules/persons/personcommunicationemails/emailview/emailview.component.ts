import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersoncommunicationemailComponent } from 'src/app/components/person/personcommunicationemail/personcommunicationemail.component';

@Component({
  selector: 'app-emailview',
  templateUrl: './emailview.component.html',
  styleUrls: ['./emailview.component.css']
})
export class EmailviewComponent implements OnInit {
  @ViewChild("personcommunicationemails") personcommunicationemails: PersoncommunicationemailComponent;

  personemailID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personcommunicationemail) {
        this.personemailID = params.personcommunicationemail;
      }
    });
  }

  refresh() {
    this.personcommunicationemails.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/communications"], { queryParams: {} });
  }
}
