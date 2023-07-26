import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './view/home/home.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';
import {EmployeeComponent} from './view/modules/employee/employee.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import{ArrearsbyprogramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {MatChipsModule} from "@angular/material/chips";
import {DatePipe} from "@angular/common";
import { CourseComponent } from './view/modules/course/course.component';
import { ClassComponent } from './view/modules/class/class.component';
import {BatchComponent} from "./view/modules/batch/batch.component";
import { StudentComponent } from './view/modules/student/student.component';
import {UserComponent} from "./view/modules/user/user.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {AuthorizationManager} from "./service/authorizationmanager";
import { JwtInterceptor } from './service/JwtInterceptor';
import {RegisterComponent} from "./view/modules/register/register.component";
import { ClassreviewComponent } from './view/modules/classreview/classreview.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    EmployeeComponent,
    DashboardComponent,
    MessageComponent,
    ConfirmComponent,
    ArrearsbyprogramComponent,
    CourseComponent,
    ClassComponent,
    BatchComponent,
    StudentComponent,
    UserComponent,
    PrivilageComponent,
    RegisterComponent,
    ClassreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatChipsModule,
    FormsModule,
    HttpClientModule,
    DatePipe,
    MatNativeDateModule

  ],
  providers: [
    DatePipe,
    AuthorizationManager,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})






export class AppModule { }
