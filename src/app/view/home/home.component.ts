import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

interface SessionsProgram {
  sessionStartTime: string;
  sessionId: string;
  studentId: string;
  grade: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  data!: MatTableDataSource<SessionsProgram>;

  columns: string[] = ['session start time (EST)', 'session id', 'student id','grade'];
  headers: string[] = ['Session Start Time (EST)', 'Session ID', 'Student ID','Grade'];
  binders: string[] = ['sessionStartTime', 'sessionId', 'studentId','grade',];

  userspecmessages: any[] = [
    {name: 'ashan@earth.lk', updated: new Date('5/30/23')},
    {name: 'rukmal@earth.lk', updated: new Date('5/17/23')},
    {name: 'it@earth.lk', updated: new Date('5/28/23')},
    {name: 'it@earth.lk', updated: new Date('4/28/23')},
  ];

  buttons: any[] = [
    { label: 'Live Tracker' },
    { label: 'Swap Session' },
    { label: 'PSR' }
  ];

  constructor() {
    const sessionData: SessionsProgram[] = [
      { sessionStartTime: '6-23-2023 08:46 AM', sessionId: '14K157-1-1', studentId: 'ABC123', grade: '6th' },
      { sessionStartTime: '6-25-2023 08:46 AM', sessionId: '15K158-2-1', studentId: 'DEF456', grade: '7th' },
      { sessionStartTime: '6-27-2023 08:46 AM', sessionId: '16K159-3-1', studentId: 'GHI789', grade: '8th' },
      { sessionStartTime: '6-29-2023 08:46 AM', sessionId: '17K159-3-1', studentId: 'JKL101', grade: '9th' },
    ];

    this.data = new MatTableDataSource<SessionsProgram>(sessionData);
  }

}
