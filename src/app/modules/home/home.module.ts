import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  DxMenuModule,
  DxRangeSelectorModule,
  DxPopupModule,
  DxChartModule,
  DxPieChartModule,
  DxVectorMapModule,
  DxDataGridModule,
  DxBulletModule,
  DxButtonModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxDropDownButtonModule,
} from 'devextreme-angular';
import { IconPickerModule } from "ngx-icon-picker";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

//location
import { LocationComponent } from 'src/app/components/location/location/location.component';
import { LocationsearchfilterComponent } from 'src/app/components/location/locationsearchfilter/locationsearchfilter.component';

//lookup/common
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { FiletypeComponent } from 'src/app/components/common/filetype/filetype.component';
import { NavigationComponent } from 'src/app/components/common/navigation/navigation.component';
import { SequencenumberComponent } from 'src/app/components/common/sequencenumber/sequencenumber.component';
import { InstituteComponent } from 'src/app/components/common/institute/institute.component';
import { InstitutecourseComponent } from 'src/app/components/common/institutecourse/institutecourse.component';
import { CourseComponent } from 'src/app/components/common/course/course.component';
import { QualificationComponent } from 'src/app/components/common/qualification/qualification.component';

import { AddresstypeComponent } from 'src/app/components/lookup/common/addresstype/addresstype.component';
import { ContacttypeComponent } from 'src/app/components/lookup/common/contacttype/contacttype.component';
import { WeekdayComponent } from 'src/app/components/lookup/common/weekday/weekday.component';

//lookup//person
import { CareerlevelComponent } from 'src/app/components/lookup/person/careerlevel/careerlevel.component';
import { CompetencyComponent } from 'src/app/components/lookup/person/competency/competency.component';
import { DisabilityComponent } from 'src/app/components/lookup/person/disability/disability.component';
import { DocumenttypeComponent } from 'src/app/components/lookup/person/documenttype/documenttype.component';
import { DomicileComponent } from 'src/app/components/lookup/person/domicile/domicile.component';
import { EducationattendancemodeComponent } from 'src/app/components/lookup/person/educationattendancemode/educationattendancemode.component';
import { EducationinstituteComponent } from 'src/app/components/lookup/person/educationinstitute/educationinstitute.component';
import { EducationsystemComponent } from 'src/app/components/lookup/person/educationsystem/educationsystem.component';
import { EthnicComponent } from 'src/app/components/lookup/person/ethnic/ethnic.component';
import { FluencyComponent } from 'src/app/components/lookup/person/fluency/fluency.component';
import { GenderComponent } from 'src/app/components/lookup/person/gender/gender.component';
import { GradingsystemComponent } from 'src/app/components/lookup/person/gradingsystem/gradingsystem.component';
import { IdentitytypeComponent } from 'src/app/components/lookup/person/identitytype/identitytype.component';
import { ImmigrationstatusComponent } from 'src/app/components/lookup/person/immigrationstatus/immigrationstatus.component';
import { LanguageComponent } from 'src/app/components/lookup/person/language/language.component';
import { MaritalstatusComponent } from 'src/app/components/lookup/person/maritalstatus/maritalstatus.component';
import { MembershiptypeComponent } from 'src/app/components/lookup/person/membershiptype/membershiptype.component';
import { NationalityComponent } from 'src/app/components/lookup/person/nationality/nationality.component';
import { PersonqualificationcountryComponent } from 'src/app/components/lookup/person/personqualificationcountry/personqualificationcountry.component';
import { PersonrelationshipComponent } from 'src/app/components/lookup/person/personrelationship/personrelationship.component';
import { QualificationstatusComponent } from 'src/app/components/lookup/person/qualificationstatus/qualificationstatus.component';
import { ReferenceComponent } from 'src/app/components/lookup/person/reference/reference.component';
import { ReferencecountryComponent } from 'src/app/components/lookup/person/referencecountry/referencecountry.component';
import { ReligionComponent } from 'src/app/components/lookup/person/religion/religion.component';
import { ResidentialComponent } from 'src/app/components/lookup/person/residential/residential.component';
import { SexComponent } from 'src/app/components/lookup/person/sex/sex.component';
import { SexualorientationComponent } from 'src/app/components/lookup/person/sexualorientation/sexualorientation.component';
import { WorkfieldComponent } from 'src/app/components/lookup/person/workfield/workfield.component';
import { WorktypeComponent } from 'src/app/components/lookup/person/worktype/worktype.component';

// lookup/company
import { OrganizationtypeComponent } from 'src/app/components/lookup/company/organizationtype/organizationtype.component';
import { OrganizationcategoryComponent } from 'src/app/components/lookup/company/organizationcategory/organizationcategory.component';
import { OrganizationsectorComponent } from 'src/app/components/lookup/company/organizationsector/organizationsector.component';
import { BusinessnatureComponent } from 'src/app/components/lookup/company/businessnature/businessnature.component';
import { CompanystatusComponent } from 'src/app/components/lookup/company/companystatus/companystatus.component';
import { CompanytypeComponent } from 'src/app/components/lookup/company/companytype/companytype.component';

//lookup//academics
import { AssessmenttypeComponent } from 'src/app/components/lookup/academics/assessmenttype/assessmenttype.component';
import { AwardingbodyComponent } from 'src/app/components/lookup/academics/awardingbody/awardingbody.component';
import { CollegetypeComponent } from 'src/app/components/lookup/academics/collegetype/collegetype.component';
import { CourseaimComponent } from 'src/app/components/lookup/academics/courseaim/courseaim.component';
import { CoursefeeplanComponent } from 'src/app/components/lookup/academics/coursefeeplan/coursefeeplan.component';
import { CoursemodeComponent } from 'src/app/components/lookup/academics/coursemode/coursemode.component';
import { CoursemoduletypeComponent } from 'src/app/components/lookup/academics/coursemoduletype/coursemoduletype.component';
import { QualificationtypeComponent } from 'src/app/components/lookup/academics/qualificationtype/qualificationtype.component';
import { RegulatorybodyComponent } from 'src/app/components/lookup/academics/regulatorybody/regulatorybody.component';
import { RoomtypeComponent } from 'src/app/components/lookup/academics/roomtype/roomtype.component';
import { SubjectComponent } from 'src/app/components/lookup/academics/subject/subject.component';
import { TeachertrainingcourseComponent } from 'src/app/components/lookup/academics/teachertrainingcourse/teachertrainingcourse.component';

//lookup/application/
import { ApplicationtypeComponent } from 'src/app/components/lookup/application/applicationtype/applicationtype.component';

//lookup//location
import { LocationleveltypeComponent } from 'src/app/components/lookup/location/locationleveltype/locationleveltype.component';
import { LocationstudyComponent } from 'src/app/components/lookup/location/locationstudy/locationstudy.component';
import { ProvisiontypeComponent } from 'src/app/components/lookup/location/provisiontype/provisiontype.component';

//userlogin
import { ApplicationComponent } from 'src/app/components/userlogin/application/application.component';
import { ApplicationuserComponent } from 'src/app/components/userlogin/applicationuser/applicationuser.component';
import { LoginprivilegeComponent } from 'src/app/components/userlogin/loginprivilege/loginprivilege.component';
import { LoginprivilegecategoryComponent } from 'src/app/components/userlogin/loginprivilegecategory/loginprivilegecategory.component';
import { LoginroleComponent } from 'src/app/components/userlogin/loginrole/loginrole.component';
import { LoginroleprivilegeComponent } from 'src/app/components/userlogin/loginroleprivilege/loginroleprivilege.component';
import { LoginroleuserComponent } from 'src/app/components/userlogin/loginroleuser/loginroleuser.component';
import { LoginuserComponent } from 'src/app/components/userlogin/loginuser/loginuser.component';
import { LoginuserprivilegeComponent } from 'src/app/components/userlogin/loginuserprivilege/loginuserprivilege.component';

//person//
import { PersontitleComponent } from 'src/app/components/person/persontitle/persontitle.component';
import { PersonComponent } from 'src/app/components/person/person/person.component';
import { PersoncommunicationemailComponent } from 'src/app/components/person/personcommunicationemail/personcommunicationemail.component';
import { PersoncommunicationletterComponent } from 'src/app/components/person/personcommunicationletter/personcommunicationletter.component';
import { PersoncommunicationsmsComponent } from 'src/app/components/person/personcommunicationsms/personcommunicationsms.component';
import { PersoncontactComponent } from 'src/app/components/person/personcontact/personcontact.component';
import { PersoncontactaddressComponent } from 'src/app/components/person/personcontactaddress/personcontactaddress.component';
import { PersondocumentComponent } from 'src/app/components/person/persondocument/persondocument.component';
import { PersoneducationinstituteComponent } from 'src/app/components/person/personeducationinstitute/personeducationinstitute.component';
import { PersoneducationqualificationComponent } from 'src/app/components/person/personeducationqualification/personeducationqualification.component';
import { PersonemploymentComponent } from 'src/app/components/person/personemployment/personemployment.component';
import { PersonequalityComponent } from 'src/app/components/person/personequality/personequality.component';
import { PersonidentityComponent } from 'src/app/components/person/personidentity/personidentity.component';
import { PersonlanguageComponent } from 'src/app/components/person/personlanguage/personlanguage.component';
import { PersonmembershipComponent } from 'src/app/components/person/personmembership/personmembership.component';
import { PersonreferenceComponent } from 'src/app/components/person/personreference/personreference.component';
import { ReferencepersonComponent } from 'src/app/components/person/referenceperson/referenceperson.component';

//employee//
import { EmployeeComponent } from 'src/app/components/employee/employee/employee.component';

//Company//
import { CompanyComponent } from 'src/app/components/company/company/company.component';
import { OrganizationComponent } from 'src/app/components/company/organization/organization.component';
import { CompanysubtypeComponent } from '../../components/company/companysubtype/companysubtype.component';
import { CompanycontactaddressComponent } from '../../components/company/companycontactaddress/companycontactaddress.component';
import { CompanycontactComponent } from '../../components/company/companycontact/companycontact.component';

//Communication//
import { EmailsettingComponent } from 'src/app/components/communication/emailsetting/emailsetting.component';
import { LettercategoryComponent } from 'src/app/components/communication/lettercategory/lettercategory.component';
import { LetterheadComponent } from 'src/app/components/communication/letterhead/letterhead.component';
import { LettertemplateComponent } from 'src/app/components/communication/lettertemplate/lettertemplate.component';
import { LoginusermaillabelComponent } from 'src/app/components/communication/loginusermaillabel/loginusermaillabel.component';
import { LoginusermailmessageComponent } from 'src/app/components/communication/loginusermailmessage/loginusermailmessage.component';
import { LoginusermailmessageattachmentComponent } from 'src/app/components/communication/loginusermailmessageattachment/loginusermailmessageattachment.component';
import { LoginusermailmessagelabelComponent } from 'src/app/components/communication/loginusermailmessagelabel/loginusermailmessagelabel.component';
import { LoginusermailmessagerecipientComponent } from 'src/app/components/communication/loginusermailmessagerecipient/loginusermailmessagerecipient.component';


import { EmailviewComponent } from '../persons/personcommunicationemails/emailview/emailview.component';
import { PersoncommunicationemailsComponent } from '../persons/personcommunicationemails/personcommunicationemails.component';
import { LetterviewComponent } from '../persons/personcommunicationletters/letterview/letterview.component';
import { PersoncommunicationlettersComponent } from '../persons/personcommunicationletters/personcommunicationletters.component';
import { PersoncommunicationsComponent } from '../persons/personcommunications/personcommunications.component';
import { PersoncommunicationsmssComponent } from '../persons/personcommunicationsmss/personcommunicationsmss.component';
import { SmsviewComponent } from '../persons/personcommunicationsmss/smsview/smsview.component';
import { PersoncontactaddressesComponent } from '../persons/personcontactaddresses/personcontactaddresses.component';
import { PersoncontactaddressviewComponent } from '../persons/personcontactaddresses/personcontactaddressview/personcontactaddressview.component';
import { PersoncontactsComponent } from '../persons/personcontacts/personcontacts.component';
import { PersoncontactviewComponent } from '../persons/personcontacts/personcontactview/personcontactview.component';
import { PersondetailComponent } from '../persons/persondetail/persondetail.component';
import { PersondocumentsComponent } from '../persons/persondocuments/persondocuments.component';
import { PersondocumentviewComponent } from '../persons/persondocuments/persondocumentview/persondocumentview.component';
import { PersoneducationinstitutesComponent } from '../persons/personeducationinstitutes/personeducationinstitutes.component';
import { PersoneducationqualificationsComponent } from '../persons/personeducationqualifications/personeducationqualifications.component';
import { QualificationviewComponent } from '../persons/personeducationqualifications/qualificationview/qualificationview.component';
import { PersonemploymentsComponent } from '../persons/personemployments/personemployments.component';
import { PersonemploymentviewComponent } from '../persons/personemployments/personemploymentview/personemploymentview.component';
import { PersonequalitiesComponent } from '../persons/personequalities/personequalities.component';
import { PersonidentitiesComponent } from '../persons/personidentities/personidentities.component';
import { PersonidentityviewComponent } from '../persons/personidentities/personidentityview/personidentityview.component';
import { PersonlanguagesComponent } from '../persons/personlanguages/personlanguages.component';
import { PersonreferencesComponent } from '../persons/personreferences/personreferences.component';
import { PersonreferenceviewComponent } from '../persons/personreferences/personreferenceview/personreferenceview.component';
import { PersonsComponent } from '../persons/persons.component';
import { PersonviewComponent } from '../persons/personview/personview.component';


@NgModule({
  imports: [
    HomeRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    CKEditorModule,
    CommonModule,
    SharedModule,
    DxMenuModule,
    DxRangeSelectorModule,
    DxPopupModule,
    DxChartModule,
    DxPieChartModule,
    DxVectorMapModule,
    DxDataGridModule,
    DxBulletModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxDropDownButtonModule,
    IconPickerModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,

    //location
    LocationComponent,
    LocationsearchfilterComponent,

    //lookup/common
    NavigationComponent,
    AddressComponent,
    SequencenumberComponent,
    InstituteComponent,
    InstitutecourseComponent,
    CourseComponent,
    QualificationComponent,

    AddresstypeComponent,
    ContacttypeComponent,
    WeekdayComponent,

    //lookup//person
    FiletypeComponent,
    SexComponent,
    NationalityComponent,
    ResidentialComponent,
    DomicileComponent,
    MaritalstatusComponent,
    EthnicComponent,
    ReligionComponent,
    GenderComponent,
    SexualorientationComponent,
    ImmigrationstatusComponent,
    IdentitytypeComponent,
    LanguageComponent,
    FluencyComponent,
    CompetencyComponent,
    MembershiptypeComponent,
    DisabilityComponent,
    DocumenttypeComponent,
    EducationinstituteComponent,
    EducationattendancemodeComponent,
    EducationsystemComponent,
    QualificationstatusComponent,
    GradingsystemComponent,
    WorktypeComponent,
    WorkfieldComponent,
    CareerlevelComponent,
    PersonqualificationcountryComponent,
    PersonrelationshipComponent,
    ReferenceComponent,
    ReferencecountryComponent,

    //lookup/company
    OrganizationtypeComponent,
    OrganizationsectorComponent,
    OrganizationcategoryComponent,
    BusinessnatureComponent,
    CompanystatusComponent,
    CompanytypeComponent,
    
    //lookup//academics
    AssessmenttypeComponent,
    CoursemoduletypeComponent,
    AwardingbodyComponent,
    CollegetypeComponent,
    CourseaimComponent,
    CoursefeeplanComponent,
    CoursemodeComponent,
    QualificationtypeComponent,
    RoomtypeComponent,
    SubjectComponent,
    TeachertrainingcourseComponent,
    RegulatorybodyComponent,

    //lookup/application/
    ApplicationtypeComponent,

    //lookup//location
    LocationleveltypeComponent,
    LocationstudyComponent,
    ProvisiontypeComponent,

    //loginuser
    ApplicationComponent,
    LoginuserComponent,
    LoginuserprivilegeComponent,
    LoginprivilegeComponent,
    ApplicationuserComponent,
    LoginprivilegecategoryComponent,
    LoginroleComponent,
    LoginroleprivilegeComponent,
    LoginroleuserComponent,

    //person//
    PersontitleComponent,
    PersonComponent,
    PersoncommunicationemailComponent,
    PersoncommunicationletterComponent,
    PersoncommunicationsmsComponent,
    PersoncontactComponent,
    PersoncontactaddressComponent,
    PersondocumentComponent,
    PersoneducationinstituteComponent,
    PersoneducationqualificationComponent,
    PersonemploymentComponent,
    PersonequalityComponent,
    PersonidentityComponent,
    PersonlanguageComponent,
    PersonmembershipComponent,
    PersonreferenceComponent,
    ReferencepersonComponent,

    //employee//
    EmployeeComponent,

    //Company//
    CompanyComponent,
    OrganizationComponent, 
    CompanysubtypeComponent, 
    CompanycontactaddressComponent,
    CompanycontactComponent, 

    //Communication//
    EmailsettingComponent,
    LettercategoryComponent,
    LetterheadComponent,
    LettertemplateComponent,
    LoginusermaillabelComponent,
    LoginusermailmessageComponent,
    LoginusermailmessageattachmentComponent,
    LoginusermailmessagelabelComponent,
    LoginusermailmessagerecipientComponent,

    PersonsComponent,
    PersonviewComponent,
    PersondetailComponent,
    PersonidentitiesComponent,
    PersonidentityviewComponent,
    PersonequalitiesComponent,
    PersoncontactsComponent,
    PersoncontactviewComponent,
    PersoneducationinstitutesComponent,
    PersoneducationqualificationsComponent,
    QualificationviewComponent,
    PersonlanguagesComponent,
    PersonemploymentsComponent,
    PersonemploymentviewComponent,
    PersonreferencesComponent,
    PersonreferenceviewComponent,
    PersondocumentsComponent,
    PersondocumentviewComponent,
    PersoncommunicationsComponent,
    PersoncommunicationemailsComponent,
    EmailviewComponent,
    PersoncommunicationlettersComponent,
    LetterviewComponent,
    PersoncommunicationsmssComponent,
    SmsviewComponent,
    PersoncontactaddressviewComponent,
    PersoncontactaddressesComponent,

  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
