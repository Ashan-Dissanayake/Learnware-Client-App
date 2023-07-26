import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Class} from "../../../entity/Class";
import {MatPaginator} from "@angular/material/paginator";
import {Student} from "../../../entity/student";
import {UiAssist} from "../../../util/ui/ui.assist";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../../../service/studentservice";
import {Studentstatus} from "../../../entity/studentstatus";
import {Classstatus} from "../../../entity/Classstatus";
import {StudentstatusService} from "../../../service/studentstatusservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Guardiantype} from "../../../entity/guardiantype";
import {GuardiantypeService} from "../../../service/guardiantypeservice";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit{

  columns:string[] = ['name','phoneno','gaurdianname','dob','studentstatus'];
  headers: string[] = ['Name', 'Mobile', 'Guardian Name', 'Birth Date', 'Status'];
  binders: string[] = ['name', 'phoneno', 'gaurdianname', 'dob', 'studentstatus.name'];

  cscolumns:string[] = ['csname','csphoneno','csguardianname','csdob','csstudentstatus'];
  csprompts: string[] = ['Search by Name', 'Search by Mobile', 'Search by Guardian','Search by DOB', 'Search by Status'];

  imageurl: string = '';

  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  student !: Student;
  oldstudent !: Student;

  students : Array<Student> = [];
  studentstatuses : Array<Studentstatus> = [];
  guardiantypes : Array<Guardiantype> = [];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  data!: MatTableDataSource<Student>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(private fb:FormBuilder,
              private ss:StudentService,
              private sss:StudentstatusService,
              private dg:MatDialog,
              private gt:GuardiantypeService,
              private rs:RegexService,
              private dp:DatePipe
              ) {

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "csphoneno": new FormControl(),
      "csguardianname": new FormControl(),
      "csdob": new FormControl(),
      "csstudentstatus": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "ssname": new FormControl(),
      "ssmobile": new FormControl(),
      "ssstatus": new FormControl()
    });

    this.form = this.fb.group({
      "fullname": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "callingname": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "phoneno": new FormControl('', [Validators.required]),
      "emergencyno": new FormControl('', [Validators.required]),
      "dob": new FormControl('', [Validators.required]),
      "gaurdianname": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "doregisterd": new FormControl('', [Validators.required]),
      "gaurdiantype": new FormControl('',[Validators.required] ),
      "studentstatus": new FormControl('',[Validators.required] ),
    }, {updateOn: 'change'});

    this.uiassist = new UiAssist(this);
  }

  ngOnInit() {

    this.initialize();
  }

  initialize(){
    this.createView();

    this.sss.getAllList().then((stts:Studentstatus[])=>{
      this.studentstatuses = stts;
    });

    this.gt.getAllList().then((stts:Guardiantype[])=>{
      this.guardiantypes = stts;
    });

    this.rs.get('student').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string){
    this.ss.getAll(query)
      .then((std: Student[]) => {
        this.students = std;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.students);
        this.data.paginator = this.paginator;
      });
  }

  createForm(){
    this.form.controls['fullname'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['callingname'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['phoneno'].setValidators([Validators.required]);
    this.form.controls['dob'].setValidators([Validators.required]);
    this.form.controls['gaurdianname'].setValidators([Validators.required]);
    this.form.controls['emergencyno'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['doregisterd'].setValidators([Validators.required]);
    this.form.controls['gaurdiantype'].setValidators([Validators.required]);
    this.form.controls['studentstatus'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dob" || controlName == "doregistered")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldstudent != undefined && control.valid) {
            // @ts-ignore
            if (value === this.student[controlName]) {
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
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (student: Student, filter: string) => {
      return (cserchdata.csname == null || student.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csphoneno == null || student.phoneno.toLowerCase().includes(cserchdata.csphoneno)) &&
        (cserchdata.csguardianname == null || student.gaurdianname.toLowerCase().includes(cserchdata.csguardianname)) &&
        (cserchdata.csdob == null || student.dob.toLowerCase().includes(cserchdata.csdob)) &&
        (cserchdata.csstudentstatus == null || student.studentstatus.name.toLowerCase().includes(cserchdata.csstudentstatus));
    };

    this.data.filter = 'xx';

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

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();


    let name = sserchdata.ssname;
    let mobile = sserchdata.ssmobile;
    let statusid = sserchdata.ssstatus;

    let query = "";

    if (name != null) query = query + "&name=" + name;
    if (mobile != null) query = query + "&mobile=" + mobile;
    if (statusid != null) query = query + "&statusid=" + statusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(){
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Class Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.student = this.form.getRawValue();

      let studata: string = "";

      studata = studata + "<br>Student Name is : " + this.student.fullname;
      studata = studata + "<br>MobileNo is : " + this.student.phoneno;
      studata = studata + "<br>Live in : " + this.student.address;
      console.log(this.student.description);

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Class Add",
          message: "Are you sure to Add the folowing Student? <br> <br>" + studata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";
      //console.log("1111111111");

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");

          this.ss.add(this.student).then((responce: [] | undefined) => {
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              console.log("1111111111");
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
              //this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Student Add", message: addmessage}
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

  fillForm(student: Student) {

    this.enableButtons(false,true,true);

    this.selectedrow= student;

    this.student = JSON.parse(JSON.stringify(student));

    this.oldstudent = JSON.parse(JSON.stringify(student));


    //@ts-ignore
    this.student.gaurdiantype = this.guardiantypes.find(gt => gt.id === this.student.gaurdiantype.id);
    //@ts-ignore
    this.student.studentstatus = this.studentstatuses.find(ss => ss.id === this.student.studentstatus.id);
    console.log(this.student);

    this.form.patchValue(this.student);
    this.form.markAsPristine();

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

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Student Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Student Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.student = this.form.getRawValue();
            this.student.id = this.oldstudent.id;

            this.ss.update(this.student).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) {
                  // @ts-ignore
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
                data: {heading: "Status -Student Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Student Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Employee Delete",
        message: "Are you sure to Delete folowing Student? <br> <br>" + this.student.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ss.delete(this.student.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Student Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

}
