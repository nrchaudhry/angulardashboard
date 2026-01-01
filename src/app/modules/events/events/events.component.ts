import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';

import { EventComponent } from 'src/app/components/event/event/event.component';
import { EventService } from 'src/app/components/event/event/event.service';

declare var $: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @ViewChild("events") events: EventComponent;
  @ViewChild("addevent") addevent: EventComponent;
  @ViewChild("editevent") editevent: EventComponent;

  constructor(
    private eventservice: EventService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.events.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/event"], { queryParams: { event: row.data.event_ID } });
  }

  addNew() {
    this.addevent.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editevent.event = {
      event_ID: row.data.event_ID,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editevent.event.isactive = true;
    } else {
      this.editevent.event.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
