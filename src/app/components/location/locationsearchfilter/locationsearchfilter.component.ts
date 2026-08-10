import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'app-locationsearchfilter',
  templateUrl: './locationsearchfilter.component.html',
  styleUrls: ['./locationsearchfilter.component.css']
})
export class LocationsearchfilterComponent implements OnInit {
  @ViewChildren(LocationComponent) locations: QueryList<LocationComponent>;

  @Input()
  view: number = 1;
  @Input()
  disabled: boolean = false;
  @Input()
  issearchfilter: boolean = true;
  @Input()
  isshowlables: boolean = true;
  @Input()
  locationtypeID: number = 10;
  @Input()
  locationID: number = 0;
  @Input()
  locationsearchfilterID: number = 0;

  @Output() advancedSearch = new EventEmitter();

  locationleveltypes = [];

  search = {
    locationparent_ID: null
  };

  constructor(
    private locationleveltypeservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.locationleveltypeGet();
  }

  searchfilter() {
    this.locations.forEach((child) => {
      if (child.locationID != null) 
        this.search.locationparent_ID = child.locationID;
    })
    this.advancedSearch.next(this.search);
  }

  searchfilterID() {
    var locationID;
    this.locations.forEach((child) => {
      if (child.locationID != null) 
        locationID = child.locationID;
    })
    return locationID;
  }

  reset() {
  }
  
  setLocation(locations) {
    locations.reverse();
    locations.forEach(location => {
      this.locations.forEach((child) => { 
        if (child.locationleveltypeID == location.locationleveltype_ID.id)
          child.locationID = location.location_ID;
          child.locationGetOne(location.location_ID);
        })
    });  
  }

  selectedLocation(location) {
    var found = false;
    this.locations.forEach((child) => { 
      if (found == true) {
        child.searchLocation(child.locationleveltypeID, location.location_ID);
        found = false;
        this.locationID = location.location_ID;
      }
      
      if (child.locationleveltypeID == location.locationleveltype_ID.id)
        found = true; 
    })
    this.locationID = location.location_ID;
  }

  locationleveltypeGet() {
    this.locationleveltypeservice.lookup("LOCATIONLEVELTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          response[0].locationparentID = null;
          this.locationleveltypes.push(response[0]);
          for (var a = 1; a < response.length; a++) {
            response[a].locationparentID = -1;
            if (response[a].code <= this.locationtypeID)
            this.locationleveltypes.push(response[a]);
          }
      
//          this.locationleveltypes = response;
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
