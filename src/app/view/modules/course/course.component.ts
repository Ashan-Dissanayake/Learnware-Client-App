import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Coursestatus} from "../../../entity/coursestatus";
import {Coursecategory} from "../../../entity/coursecategory";
import {Devision} from "../../../entity/devision";
import {Employee} from "../../../entity/employee";
import {UiAssist} from "../../../util/ui/ui.assist";
import {EmployeeService} from "../../../service/employeeservice";
import {RegexService} from "../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {CourseService} from "../../../service/courseservice";
import {CourscategoryService} from "../../../service/courscategoryservice";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Course} from "../../../entity/course";
import {Designation} from "../../../entity/designation";
import {CoursestatusService} from "../../../service/coursestatusservice";
import {DevisionService} from "../../../service/devisionservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit{

  columns: string[] = ['code', 'name', 'dointroduced', 'duration','credit', 'fee', 'coursecategory'];
  headers: string[] = ['Code', 'Course Name', 'Introduce Date', 'Duration', 'Credit', 'Fee','Course Categiory', 'Modification'];
  binders: string[] = ['code', 'name', 'dointroduced', 'durationtheory','credit', 'fee' ,'coursecategory.name', 'getModi()'];

  cscolumns: string[] = ['cscode', 'csname', 'cscategory','csmodi'];
  csprompts: string[] = ['Search by Code', 'Search by Name', 'Search by Category', 'Search by Modi'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  division!: Devision;
  course!: Course;
  coursecategory!: Coursecategory;
  oldcourse!: Course;
  employee!: Employee;

  courses: Array<Course> = [];

  cordinator: Array<Employee>  = [];
  deputycordinator: Array<Employee>  = [];

  coordinators!: Employee[];
  deputycoordinators!: Employee[];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  coursestatus: Array<Coursestatus> = [];
  coursecategorys: Array<Coursecategory> = [];

  divisions: Array<Devision> = [];
  employees: Array<Employee> = [];


  regexes: any;

  data!: MatTableDataSource<Course>;

  selectedrow: any;

  uiassist: UiAssist;

  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'

  constructor(
    private cs:CourseService,
    private css:CoursestatusService,
    private dv:DevisionService,
    private cc:CourscategoryService,
    private es: EmployeeService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "cscode": new FormControl(),
      "csname": new FormControl(),
      "cscategory": new FormControl(),
      "csmodi": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "sscode": new FormControl(),
      "ssname": new FormControl(),
      "sscategory": new FormControl()
    });

    this.form = this.fb.group({
      "division": new FormControl('', [Validators.required]),
      "coursecategory": new FormControl('', [Validators.required]),
      "coursestatus": new FormControl('', [Validators.required]),
      "code": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "dointroduced": new FormControl('', [Validators.required]),
      "credit": new FormControl('', [Validators.required]),
      "fee": new FormControl('', [Validators.required]),
      "durationtheory": new FormControl('', [Validators.required]),
      "durationpractical": new FormControl('', [Validators.required]),
      "dpcoordinator": new FormControl('', [Validators.required]),
      "coordinator": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
    this.createForm();
  }

  initialize() {


    this.createView();

    this.css.getAllList().then((csstatus: Coursestatus[]) => {
      this.coursestatus = csstatus;
    });

    this.cc.getAllList().then((curscat: Coursecategory[]) => {
      this.coursecategorys = curscat;
    });

    this.dv.getAllList().then((cursdv: Devision[]) => {
      this.divisions = cursdv;
    });

    this.es.getAll('').then((emps: Employee[]) => {
      this.cordinator = emps;
      this.deputycordinator = emps;
      this.coordinators = emps.filter(employee => employee.designation.id === 3);
      this.deputycoordinators = emps.filter(employee => employee.designation.id === 4);
    });

    this.rs.get('course').then((regs: []) => {
      this.regexes = regs;

      console.log(this.regexes)

      this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {
    this.form.controls['division'].setValidators([Validators.required]);
    this.form.controls['coursecategory'].setValidators([Validators.required]);
    this.form.controls['coursestatus'].setValidators([Validators.required]);
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['credit'].setValidators([Validators.required]);
    this.form.controls['fee'].setValidators([Validators.required]);
    this.form.controls['durationtheory'].setValidators([Validators.required]);
    this.form.controls['durationpractical'].setValidators([Validators.required]);
    this.form.controls['coordinator'].setValidators([Validators.required]);
    this.form.controls['dpcoordinator'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dointroduced")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldcourse != undefined && control.valid) {
            // @ts-ignore
            if (value === this.course[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }
    this.enableButtons(true,false,false);
    this.loadForm();
  }

  loadTable(query: string) {

    this.cs.getAll(query)
      .then((courses: Course[]) => {
        this.courses = courses;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.courses);
        this.data.paginator = this.paginator;
      });

  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  loadForm() {
    console.log("Initila Photo-"+JSON.stringify(this.course));
  }

  getModi(element: Course) {
    return element.code + '(' + element.name + ')';
  }

  btnSearchMc() {

  }

  btnSearchClearMc() {

  }

  filterTable() {

  }

  fillForm(course: Course) {

    this.enableButtons(false,true,true);

    this.selectedrow=course;

    this.course = JSON.parse(JSON.stringify(course));
    this.oldcourse = JSON.parse(JSON.stringify(course));

    //@ts-ignore
    this.course.coursecategory = this.coursecategorys.find(cc => cc.id === this.course.coursecategory.id);
    //@ts-ignore
    this.course.coursestatus = this.coursestatus.find(cs => cs.id === this.course.coursestatus.id);
    //@ts-ignore
    this.course.division = this.divisions.find(dv => dv.id === this.course.coursecategory.devision.id);

    //@ts-ignore
    this.course.cordinator = this.courses.find(cc => cc.id === this.course.cordinator.id);
    console.log(this.course.cordinator)

    this.form.patchValue(this.course);
    this.form.markAsPristine();

  }

  getErrors(): string {

    let errors: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Course Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.course = this.form.getRawValue();


      let crsdata: string = "";

      crsdata = crsdata + "<br>Code is : " + this.course.code;
      crsdata = crsdata + "<br>Name is : " + this.course.name;
      crsdata = crsdata + "<br>Fee is : " + this.course.fee;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Course Add",
          message: "Are you sure to Add the folowing Course? <br> <br>" + crsdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.cs.add(this.course).then((responce: [] | undefined) => {

            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Course Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Course Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Course Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.course = this.form.getRawValue();
            this.course.id = this.oldcourse.id;

            this.es.update(this.employee).then((responce: [] | undefined) => {

              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";

                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();

                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Course Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Course Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Course Delete",
        message: "Are you sure to Delete folowing Course? <br> <br>" + this.course.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.course.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Course Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }


}
