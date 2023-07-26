import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { EmployeeService } from 'src/app/service/employeeservice';
import {UserstatusService} from "../../../service/userstatusservice";
import {UserService} from "../../../service/userservice";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../../service/regexservice";
import {UiAssist} from "../../../util/ui/ui.assist";
import {User} from "../../../entity/user";
import {DatePipe} from "@angular/common";
import {Employee} from "../../../entity/employee";
import {Userstatus} from "../../../entity/userstatus";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Topic} from "../../../entity/topic";
import {Topicservice} from "../../../service/topicservice";
import {ClassreviewService} from "../../../service/ClassreviewService";
import {Classreview} from "../../../entity/classreview";
import {MatSelectionList} from "@angular/material/list";
import {Lesson} from "../../../entity/lesson";
import {Class} from "../../../entity/Class";
import {ClassService} from "../../../service/classservice";

@Component({
  selector: 'app-classreview',
  templateUrl: './classreview.component.html',
  styleUrls: ['./classreview.component.css']
})
export class ClassreviewComponent implements OnInit{

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  teachers: Employee[] = [];
  classes: Class[] = [];
  filteredClasses: Class[] = [];
  lessons: Array<Lesson> = [];

  userstatues: Array<Userstatus> = [];
  classreviews: Array<Classreview> = [];

  @Input()topics: Array<Topic> = [];
  oldtopics:Array<Topic>=[];
  @Input()selectedtopics: Array<Topic> =[];

  classreview!:Classreview;
  oldclassreview!:Classreview;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  columns: string[] = ['teacher', 'docreated', 'userstatus','remarks','toreated'];
  headers: string[] = ['Teacher', 'DoReview', 'Status','Remarks','To Review'];
  binders: string[] = ['clazz.teacher.callingname', 'getDate()', 'clazz.teacher.employeestatus.name','remarks','toreview'];

  selectedrow: any;
  data !:MatTableDataSource<Classreview>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist: UiAssist;
  regexes:any;
  imageurl: string = '';

  constructor(
    private fb:FormBuilder,
    private es:EmployeeService,
    private ut:UserstatusService,
    private us:ClassreviewService,
    private dg:MatDialog,
    private dp:DatePipe,
    private rx:RegexService,
    private ts:Topicservice,
    private cs:ClassService
  ) {
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csteacher": new FormControl(),
      "csclass": new FormControl(),
      "csdocreated": new FormControl(),
      "cstopics": new FormControl(),
      "csremarks": new FormControl(),
      "cstimelost": new FormControl(),

    });

    this.form = this.fb.group({
      "teacher": new FormControl('',[Validators.required]),
      "class": new FormControl('',[Validators.required]),
      "review": new FormControl(),
      "docreated": new FormControl('',[Validators.required]),
      "timelost": new FormControl(this.dp.transform(Date.now(),"hh:mm:ss"),[Validators.required]),
      "reason": new FormControl('',[Validators.required]),
      "remarks": new FormControl('',Validators.required),
      "topics": new FormControl('',[Validators.required])
    });

    this.ssearch = this.fb.group({
      "ssteacher": new FormControl(),
      "ssclass": new FormControl(),
      "sstopics": new FormControl(),
    });

  }
  async ngOnInit(): Promise<void> {
    this.initialize();
  }

  initialize(){

    this.createView();

    this.es.getAllListNameId().then((emps: Employee[]) => {
      this.teachers = emps;
    });

    this.cs.getAll('').then((cls: Class[]) => {
      this.classes = cls;
    });

    this.es.getAllListNameId().then((emps: Employee[]) => {
      this.teachers = emps;
    }).catch(error => {
      console.error('Error fetching teachers:', error);
    });

    this.ut.getAllList().then((usts:Userstatus[]) => {
      this.userstatues = usts;
    });

    this.ts.getAllList().then((topics:Topic[])=>{
      this.topics = topics;
      this.oldtopics = Array.from(this.topics);
    });

    this.rx.get("users").then((regs:[])=>{
      this.regexes = regs;
      // this.createForm();
    });

  }

  onTeacherChange() {
    const selectedTeacher = this.form.get('teacher')?.value;
    if (selectedTeacher) {
      this.filteredClasses = this.classes.filter(cls => cls.teacher.id === selectedTeacher.id);
      // Filter classes based on the selected teacher's id.
      this.form.get('class')?.setValue(null); // Reset the selected class.
    } else {
      this.filteredClasses = [];
    }
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string):void{

    this.us.getAll(query)
      .then((classreviews: Classreview[]) => {
        this.classreviews = classreviews;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.classreviews);
        this.data.paginator = this.paginator;
      });

  }

  getDate(element: Classreview) {
    return this.dp.transform(element.doreview,'yyyy-MM-dd');
  }


  rightSelected(): void {

    this.classreview.clazz = this.availablelist.selectedOptions.selected.map(option => {
      const classa = new Class(option.value);
      console.log(classa)
      // this.roles = this.roles.filter(role => role !== option.value); //Remove Selected
      // this.userroles.push(class); // Add selected to Right Side
      return classa;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity(); // Update status

  }

  //
  // leftSelected(): void {
  //   const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
  //   for (const option of selectedOptions) {
  //     const extUserRoles = option.value;
  //     this.userroles = this.userroles.filter(role => role !== extUserRoles); // Remove the Selected one From Right Side
  //     this.roles.push(extUserRoles.role)
  //   }
  // }
  //
  // rightAll(): void {
  //   this.user.userroles = this.availablelist.selectAll().map(option => {
  //     const userRole = new Userrole(option.value);
  //     this.roles = this.roles.filter(role => role !== option.value);
  //     this.userroles.push(userRole);
  //     return userRole;
  //   });
  //
  //   this.form.controls["userroles"].clearValidators();
  //   this.form.controls["userroles"].updateValueAndValidity();
  // }
  // leftAll():void{
  //   for(let userrole of this.userroles) this.roles.push(userrole.role);
  //   this.userroles = [];
  // }

}
