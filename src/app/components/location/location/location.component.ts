import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { LookupService } from '../../../services/lookup.service';

import { LocationleveltypeComponent } from '../../lookup/location/locationleveltype/locationleveltype.component'
import { LocationsearchfilterComponent } from '../locationsearchfilter/locationsearchfilter.component'
import { LocationService } from './location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  @ViewChild("locationleveltype") locationleveltype: LocationleveltypeComponent;
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;
  @ViewChild("addlocation") addlocation: LocationComponent;
  @ViewChild("editlocation") editlocation: LocationComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isshowlables: boolean = true;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  locationID = null;
  @Input()
  locationleveltypeID = null;
  @Input()
  locationparentID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() selectedLocation = new EventEmitter();
  @Output() viewLocation = new EventEmitter();

  locationleveltypeLABEL = null;
  locations = [];
  locationsAll = [];
  location = {
    location_ID: 0,
    location_NAME: "",
    location_CODE: "",
    location_DESC: "",
    locationleveltype_ID: {
      id: null
    },
    locationparent_ID: null,
    latitude: null,
    longitude: null,
    altitude: null,
    isactive: true
  }
  search = {
    locationleveltype_ID: null,
    locationparent_ID: null
  }

  constructor(
    private locationservice: LocationService,
    private locationleveltypeservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.locations = JSON.parse(window.sessionStorage.getItem('locations'));
    this.locationsAll = JSON.parse(window.sessionStorage.getItem('locationsAll'));
    if (this.view == 1 && this.locations == null) {
      this.locationGet();
    } else if (this.view == 6) {
      this.search = {
        locationleveltype_ID: this.locationleveltypeID,
        locationparent_ID: this.locationparentID
      }
      this.locationGetAdvancedSearchAll(this.search);
      this.locationleveltypeGetOne(this.locationleveltypeID);
    }

    if (this.locationID) {
      this.locationGetOne(this.locationID);

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
          onClick: this.locationGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.addlocation.locationID = null;
    this.location = {
      location_ID: 0,
      location_NAME: "",
      location_CODE: "",
      location_DESC: "",
      locationleveltype_ID: {
        id: null
      },
      locationparent_ID: null,
      latitude: null,
      longitude: null,
      altitude: null,
      isactive: true
    };
  }

  update(row) {
    this.edit.next(row);
  }

  viewlocation(row) {
    this.viewLocation.next(row);
  }

  changeLocation(location) {
    for (var i=0; i<this.locationsAll.length; i++) {
      if (location == this.locationsAll[i].location_ID)
        this.selectedLocation.next(this.locationsAll[i]);
    }
  }

  searchLocation(locationleveltype, locationparent) {
    this.locationleveltypeID = locationleveltype;
    this.locationparentID = locationparent;
    this.search = {
      locationleveltype_ID: this.locationleveltypeID,
      locationparent_ID: this.locationparentID
    }
    this.locationGetAdvancedSearchAll(this.search);
  }

  refreshLocation() {
    this.locationGetAdvancedSearchAll(this.search);
  }

  locationEdit(){
    this.disabled = false;
  }

  locationCancel() {
    this.disabled = true;
    if (this.location.location_ID==0) {
      this.router.navigate(["/home/locations"], {});
    }
  }
  setlocations(response) {
    if (this.view == 1) {
      this.locations = response;
      window.sessionStorage.setItem("locations", JSON.stringify(this.locations));
    } else {
      this.locationsAll = response;
      window.sessionStorage.setItem("locationsAll", JSON.stringify(this.locationsAll));
    }
    this.cancel.next();
  }

  locationGet() {
    this.locationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          response = this.locationservice.getAllDetail(response);
          this.setlocations(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationGetAll() {
    this.locationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          response = this.locationservice.getAllDetail(response);
          this.setlocations(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationGetOne(id) {
    this.locationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          response = this.locationservice.getDetail(response);
          this.location = response;
          this.disabled = true;
          this.selectedLocation.next(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationGetAdvancedSearchAll(search) {
    this.locationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          response = this.locationservice.getAllDetail(response);
          this.setlocations(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationAdd(location) {
    location.locationleveltype_ID = this.locationleveltype.locationleveltypeID;
    location.locationparent_ID = this.locationsearchfilter.searchfilterID();
    this.locationservice.add(location).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.location_ID) {
          this.toastrservice.success("Success", "New Location Added");
          this.locationGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationUpdate(location) {
    location.locationleveltype_ID = this.locationleveltype.locationleveltypeID;
    location.locationparent_ID = this.editlocation.locationID;
    console.log(location);
    if (location.isactive == true) {
      location.isactive = "Y";
    } else {
      location.isactive = "N";
    }
    this.locationservice.update(location, location.location_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.location_ID) {
          this.toastrservice.success("Success", " Location Updated");
          this.locationGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationleveltypeGetOne(id){
    this.locationleveltypeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.locationleveltypeLABEL = response.description;
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
