import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { PersondetailComponent } from '../persons/persondetail/persondetail.component';

import { MembershipsComponent } from '../memberships/memberships/memberships.component';
import { MembershipviewComponent } from '../memberships/memberships/membershipview/membershipview.component';

import { EventsComponent } from '../events/events/events.component';
import { EventviewComponent } from '../events/events/eventview/eventview.component';
import { EventmediasComponent } from '../events/eventmedias/eventmedias.component';
import { EventmediaviewComponent } from '../events/eventmedias/eventmediaview/eventmediaview.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'profile', component: PersondetailComponent },

    { path: 'dashboard', component: DashboardComponent },

    { path: 'membersips', component: MembershipsComponent },
    { path: 'membersip', component: MembershipviewComponent },

    { path: 'events', component: EventsComponent },
    { path: 'event', component: EventviewComponent },
    { path: 'eventmedias', component: EventmediasComponent },
    { path: 'eventmedia', component: EventmediaviewComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
