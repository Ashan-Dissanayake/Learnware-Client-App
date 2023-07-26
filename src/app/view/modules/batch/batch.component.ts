import {Component, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {Batch} from "../../../entity/batch";
import {MatTableDataSource} from "@angular/material/table";
import {Batchstatus} from "../../../entity/batchstatus";
import {Day} from "../../../entity/day";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Batchstatusservice} from "../../../service/batchstatusservice";
import {Dayservice} from "../../../service/dayservice";
import {Batchservice} from "../../../service/batchservice";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Course} from "../../../entity/course";
import {CourseService} from "../../../service/courseservice";
import {EmployeeService} from "../../../service/employeeservice";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Class} from "../../../entity/Class";

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit{



  columns: string[] = ['number', 'course', 'name', 'employee', 'batchstatus'];
  headers: string[] = ['Number', 'Course', 'Batch Name', 'Coordinator', 'Batch Status'];
  binders: string[] = ['number', 'course.name', 'name', 'employee.callingname', 'batchstatus.name'];

  cscolumns: string[] = ['csnumber', 'cscourse', 'csname', 'cscordinator', 'csbatchstatus'];
  csprompts: string[] = ['Search by Number', 'Search by Number', 'Search by Name','Search by Cordinator', 'Search by Status'];


  data!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageurl: string = '';

  batchstatuses!:Array<Batchstatus>;
  batches!:Array<Batch>;
  days!:Array<Day>;
  courses!:Array<Course>;
  employees!: Array<Employee>;

  regexes :any;

  batch !: Batch;
  oldbatch !: Batch;


  uiassist: UiAssist;

  public batchform!: FormGroup;
  public csearch!: FormGroup;
  public ssearch!: FormGroup;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  selectedrow: any;

  constructor(
    private fb:FormBuilder,
    private bt:Batchstatusservice,
    private ds:Dayservice,
    private bs:Batchservice,
    private cs:CourseService,
    private dts:Dayservice,
    private es:EmployeeService,
    private rs:RegexService,
    private dp:DatePipe,
    private dg:MatDialog
  ) {


    this.csearch = this.fb.group({
      "cscourse": new FormControl(),
      "csnumber": new FormControl(),
      "csname": new FormControl(),
      "cscordinator": new FormControl(),
      "csbatchstatus": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "ssnumber": new FormControl(),
      "ssname": new FormControl(),
      "ssstatus": new FormControl()
    });

    this.batchform = this.fb.group({
      "course": new FormControl('', [Validators.required]),
      "day": new FormControl('', [Validators.required]),
      "number": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "dostart": new FormControl('', [Validators.required]),
      "doend": new FormControl('', [Validators.required]),
      "tostart": new FormControl('', [Validators.required]),
      "tofinish": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "batchstatus": new FormControl('', [Validators.required])
    }, {updateOn: 'change'});

    this.uiassist = new UiAssist(this);

  }

  ngOnInit(){
   this.initialize();
  }


  initialize() {

    this.createView();

    this.bt.getAllList().then((bst:Batchstatus[])=>{
      this.batchstatuses = bst;
    });

    this.ds.getAllList().then((dys:Day[])=>{
      this.days = dys;
    });

    this.es.getAllListNameId().then((emp:Employee[]) =>{
      this.employees = emp;
    });

    this.cs.getAllByList("").then((crs:Course[]) =>{
      this.courses = crs;
    });

    this.bs.getAll("").then((bts:Batch[]) =>{
      this.batches = bts;
    });

    this.rs.get('batch').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");  }


  loadTable(query: string) {

    this.bs.getAll(query).then((bch: Batch[]) => {
        this.batches = bch;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.batches);
        //console.log(JSON.stringify(this.batches));
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (batch: Batch, filter: string) => {
      return (cserchdata.cscourse == null || batch.course.name.toLowerCase().includes(cserchdata.cscourse)) &&
        (cserchdata.csnumber == null || batch.number.toLowerCase().includes(cserchdata.csnumber)) &&
        (cserchdata.csname == null || batch.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.cscordinator == null || batch.employee.callingname.toLowerCase().includes(cserchdata.cscordinator)) &&
        (cserchdata.csbatchstatus == null || batch.batchstatus.name.toLowerCase().includes(cserchdata.csbatchstatus));
    };

    this.data.filter = 'xx';

  }

  createForm() {


    this.batchform.controls['course'].setValidators([Validators.required]);//
    this.batchform.controls['day'].setValidators([Validators.required]);//
    this.batchform.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.batchform.controls['dostart'].setValidators([Validators.required]);
    this.batchform.controls['doend'].setValidators([Validators.required]);
    this.batchform.controls['tostart'].setValidators([Validators.required]);
    this.batchform.controls['tofinish'].setValidators([Validators.required]);
    this.batchform.controls['employee'].setValidators([Validators.required]);//
    this.batchform.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.batchform.controls['batchstatus'].setValidators([Validators.required]);//

    Object.values(this.batchform.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.batchform.controls) {
      const control = this.batchform.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doclass" || controlName == "dodefine")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldbatch != undefined && control.valid) {
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

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  //Add Function
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

      this.batch = this.batchform.getRawValue();

      //Covert Time To SQL Time
      this.batch.tostart = this.batch.tostart+":00";
      this.batch.tofinish = this.batch.tofinish+":00";

      let batchdata: string = "";

      batchdata = batchdata + "<br>Batch No : " + this.batch.number;
      batchdata = batchdata + "<br>Batch : " + this.batch.name;
      batchdata = batchdata + "<br>To Start in : " + this.batch.dostart;

        const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Class Add",
          message: "Are you sure to Add the folowing Batch? <br> <br>" + batchdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");

          this.bs.add(this.batch).then((responce: [] | undefined) => {
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
              this.batchform.reset();
              Object.values(this.batchform.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Batch Add", message: addmessage}
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

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.batchform.controls) {
      const control = this.batchform.controls[controlName];
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

  btnSearchMc(): void {

    const ssearchdata = this.ssearch.getRawValue();


    let snumber = ssearchdata.ssnumber;
    let name = ssearchdata.ssname;
    let statusid = ssearchdata.ssstatus;

    let query = "";

    if (snumber != null) query = query + "&number=" + snumber;
    if (name != null) query = query + "&name=" + name;
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

  fillForm(batch: Batch) {

    this.enableButtons(false,true,true);

    this.selectedrow= batch;

    this.batch = JSON.parse(JSON.stringify(batch));

    this.oldbatch = JSON.parse(JSON.stringify(batch));


    //@ts-ignore
    this.batch.course= this.courses.find(c => c.id === this.batch.course.id);
    //@ts-ignore
    this.batch.day = this.days.find(d => d.id === this.batch.day.id);
    //@ts-ignore
    this.batch.employee = this.employees.find(e => e.id === this.batch.employee.id);
    //@ts-ignore
    this.batch.batchstatus = this.batchstatuses.find(bs => bs.id === this.batch.batchstatus.id);

    this.batchform.patchValue(this.batch);
    this.batchform.markAsPristine();

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.batchform.controls) {
      const control = this.batchform.controls[controlName];
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
            this.batch = this.batchform.getRawValue();
            this.batch.id = this.oldbatch.id;

            this.bs.update(this.batch).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
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
                this.batchform.reset();
                Object.values(this.batchform.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Batch Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Batch Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete folowing Batch? <br> <br>" + this.batch.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.batch.id).then((responce: [] | undefined) => {

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
            this.batchform.reset();
            Object.values(this.batchform.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Batch Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

}
