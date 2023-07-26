import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassService} from "../../../service/classservice";
import {Class} from "../../../entity/Class";
import {ClassstatusService} from "../../../service/classstatusservice";
import {Lesson} from "../../../entity/lesson";
import {Classstatus} from "../../../entity/Classstatus";
import {LessonService} from "../../../service/lessonservice";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/employeeservice";
import {Batch} from "../../../entity/batch";
import {Batchservice} from "../../../service/batchservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit{

  columns:string[] = ['batch','lesson','teacher','tostart','toend'];
  headers: string[] = ['Batch', 'Lesson', 'Teacher', 'Time Of Start', 'Time Of End'];
  binders: string[] = ['batch.name', 'lessonByLessonId.name', 'teacher.callingname', 'tostart', 'toend'];

  cscolumns:string[] = ['csbatch','cslesson','csteacher','cstostart','cstoend'];
  csprompts: string[] = ['Search by Batch', 'Search by lesson', 'Search by Teacher','Search by To Created', 'Search by To End'];

  classes: Array<Class> = [];
  lessons: Array<Lesson> = [];
  teachers: Array<Employee> = [];
  classstatuses: Array<Classstatus> = [];
  batches: Array<Batch> = [];
  employees: Array<Employee> = [];

  class !: Class;

  oldclass !: Class;

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  imageurl: string = '';

  regexes: any;

  data!: MatTableDataSource<Class>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist: UiAssist;

  selectedrow: any;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(private fb:FormBuilder,
              private cs:ClassService,
              private ct:ClassstatusService,
              private ls:LessonService,
              private es:EmployeeService,
              private bs:Batchservice,
              private dg:MatDialog,
              private rs:RegexService,
              private dp:DatePipe

  ) {


    this.csearch = this.fb.group({
      "csbatch": new FormControl(),
      "cslesson": new FormControl(),
      "csteacher": new FormControl(),
      "cstostart": new FormControl(),
      "cstoend": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "ssbatch": new FormControl(),
      "ssteacher": new FormControl()
    });

    this.form = this.fb.group({
      "doclass": new FormControl('', [Validators.required]),
      "tostart": new FormControl('', [Validators.required]),
      "toend": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "dodefine": new FormControl('', [Validators.required]),
      "batch": new FormControl('', [Validators.required]),
      "lessonByLessonId": new FormControl('', [Validators.required]),
      "teacher": new FormControl('', [Validators.required]),
      "classstatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('',[Validators.required] ),
    }, {updateOn: 'change'});

    this.uiassist = new UiAssist(this);

  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){

    this.createView();

    this.ct.getAll().then((stts:Classstatus[])=>{
      this.classstatuses = stts;
    });

    this.ls.getAllListNameId().then((lsn:Lesson[])=>{
      this.lessons = lsn;
    });

    this.es.getAllListNameId().then((tec:Employee[])=>{
      this.teachers = tec;
    });

    this.bs.getAllListNameId().then((bat:Batch[])=>{
      this.batches = bat;
    });

    this.es.getAllListNameId().then((emp:Employee[])=>{
      this.employees = emp;
    });

    this.rs.get('class').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });



  }

  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string){

    this.cs.getAll(query)
      .then((cls: Class[]) => {
        this.classes = cls;
        // console.log( this.classes);

        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.classes);
        this.data.paginator = this.paginator;
      });

  }

  createForm(){
    this.form.controls['doclass'].setValidators([Validators.required]);
    this.form.controls['tostart'].setValidators([Validators.required]);
    this.form.controls['toend'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['dodefine'].setValidators([Validators.required]);
    this.form.controls['batch'].setValidators([Validators.required]);
    this.form.controls['lessonByLessonId'].setValidators([Validators.required]);
    this.form.controls['teacher'].setValidators([Validators.required]);
    this.form.controls['classstatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doclass" || controlName == "dodefine")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldclass != undefined && control.valid) {
            // @ts-ignore
            if (value === this.class[controlName]) {
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

    this.data.filterPredicate = (clazz: Class, filter: string) => {
      return (cserchdata.csbatch == null || clazz.batch.name.toLowerCase().includes(cserchdata.csbatch)) &&
        (cserchdata.cslesson == null || clazz.lessonByLessonId.name.toLowerCase().includes(cserchdata.cslesson)) &&
        (cserchdata.csteacher == null || clazz.teacher.callingname.toLowerCase().includes(cserchdata.csteacher)) &&
        (cserchdata.cstostart == null || clazz.tostart.toLowerCase().includes(cserchdata.cstostart)) &&
        (cserchdata.cstoend == null || clazz.toend.toLowerCase().includes(cserchdata.cstoend));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();


    let batchid = sserchdata.ssbatch;
    let teacherid = sserchdata.ssteacher;

    let query = "";

    if (batchid != null) query = query + "&batchid=" + batchid;
    if (teacherid != null) query = query + "&teacherid=" + teacherid;

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

      this.class = this.form.getRawValue();

      //Covert Time To SQL Time
      this.class.tostart = this.class.tostart+":00";
      this.class.toend = this.class.toend+":00";

      let clsdata: string = "";

      clsdata = clsdata + "<br>Teacher Name is : " + this.class.doclass;
      clsdata = clsdata + "<br>Time Of Start is : " + this.class.tostart;
      clsdata = clsdata + "<br>To Start in : " + this.class.dodefine;
      console.log(this.class.tostart);
      console.log("1111111111");

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Class Add",
          message: "Are you sure to Add the folowing Class? <br> <br>" + clsdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";
      console.log("1111111111");

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");

          this.cs.add(this.class).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
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
              data: {heading: "Status -Class Add", message: addmessage}
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
  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
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

  fillForm(clazz: Class) {

    this.enableButtons(false,true,true);

    this.selectedrow= clazz;

    this.class = JSON.parse(JSON.stringify(clazz));

    this.oldclass = JSON.parse(JSON.stringify(clazz));


    //@ts-ignore
    this.class.batch= this.batches.find(b => b.id === this.class.batch.id);
    //@ts-ignore
    this.class.lessonByLessonId = this.lessons.find(l => l.id === this.class.lessonByLessonId.id);
    //@ts-ignore
    this.class.teacher = this.teachers.find(t => t.id === this.class.teacher.id);
    //@ts-ignore
    this.class.classstatus = this.classstatuses.find(cs => cs.id === this.class.classstatus.id);
    //@ts-ignore
    this.class.employee = this.employees.find(e => e.id === this.class.employee.id);

    this.form.patchValue(this.class);
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
        data: {heading: "Errors - Class Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Class Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.class = this.form.getRawValue();
            // if (this.form.controls['photo'].dirty) this.employee.photo = btoa(this.imageempurl);
            // else this.employee.photo = this.oldemployee.photo;
            this.class.id = this.oldclass.id;

            this.cs.update(this.class).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                // this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Class Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Class Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete folowing Class? <br> <br>" + this.class.lessonByLessonId.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.class.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Employee Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }



}
