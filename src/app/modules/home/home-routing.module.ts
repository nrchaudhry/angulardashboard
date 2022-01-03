import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { PersonalComponent } from '../person/personal/personal.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'personal', component: PersonalComponent },
    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
