import {Component, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {Batch} from "../../../entity/batch";
import {MatTableDataSource} from "@angular/material/table";
import {Batchstatus} from "../../../entity/batchstatus";
import {UiAssist} from "../../../util/ui/ui.assist";
import {RegisterstatusService} from "../../../service/registerstatusservice";
import {Batchservice} from "../../../service/batchservice";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {EmployeeService} from "../../../service/employeeservice";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Class} from "../../../entity/Class";
import {Registerstatus} from "../../../entity/registerstatus";
import {Student} from "../../../entity/student";
import {Register} from "../../../entity/Register";
import {Registerservice} from "../../../service/registerservice";
import {StudentService} from "../../../service/studentservice";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  imageurl: string = '';

  registerstatuses!:Array<Registerstatus>;
  batches!:Array<Batch>;
  employees!: Array<Employee>;
  students!: Array<Student>;


  regexes :any;

  register !: Register;
  oldregister !: Register;


  uiassist: UiAssist;

  public registerform!: FormGroup;
  public csearch!: FormGroup;
  public ssearch!: FormGroup;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  selectedrow: any;

  constructor(
    private fb:FormBuilder,
    private rt:RegisterstatusService,
    private rs:Registerservice,
    private ss:StudentService,
    private bs:Batchservice,
    private es:EmployeeService,
    private rx:RegexService,
    private dp:DatePipe,
    private dg:MatDialog
  ) {

    this.registerform = this.fb.group({
      "no": new FormControl('', [Validators.required]),
      "date": new FormControl('', [Validators.required]),
      "student": new FormControl('', [Validators.required]),
      "batch": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "registerstatus": new FormControl('', [Validators.required])
    }, {updateOn: 'change'});

    this.uiassist = new UiAssist(this);

  }

  ngOnInit(){
    this.initialize();
  }


  initialize() {

    this.createView();

    this.rt.getAllList().then((rst:Registerstatus[])=>{
      this.registerstatuses = rst;
    });

    this.es.getAllListNameId().then((emp:Employee[]) =>{
      this.employees = emp;
    });

    this.ss.getAll("").then((stu:Student[]) =>{
      this.students = stu;
    });

    this.bs.getAll("").then((bts:Batch[]) =>{
      this.batches = bts;
    });

    this.rx.get('register').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    // this.loadTable("");
  }


  // loadTable(query: string) {
  //
  //   this.bs.getAll(query).then((bch: Batch[]) => {
  //     this.batches = bch;
  //     this.imageurl = 'assets/fullfilled.png';
  //   })
  //     .catch((error) => {
  //       console.log(error);
  //       this.imageurl = 'assets/rejected.png';
  //     })
  //     .finally(() => {
  //       this.data = new MatTableDataSource(this.batches);
  //       //console.log(JSON.stringify(this.batches));
  //       this.data.paginator = this.paginator;
  //     });
  //
  // }

  // filterTable(): void {
  //
  //   const cserchdata = this.csearch.getRawValue();
  //
  //   this.data.filterPredicate = (batch: Batch, filter: string) => {
  //     return (cserchdata.cscourse == null || batch.course.name.toLowerCase().includes(cserchdata.cscourse)) &&
  //       (cserchdata.csnumber == null || batch.number.toLowerCase().includes(cserchdata.csnumber)) &&
  //       (cserchdata.csname == null || batch.name.toLowerCase().includes(cserchdata.csname)) &&
  //       (cserchdata.cscordinator == null || batch.employee.callingname.toLowerCase().includes(cserchdata.cscordinator)) &&
  //       (cserchdata.csbatchstatus == null || batch.batchstatus.name.toLowerCase().includes(cserchdata.csbatchstatus));
  //   };
  //
  //   this.data.filter = 'xx';
  //
  // }

  createForm() {


    this.registerform.controls['batch'].setValidators([Validators.required]);//
    this.registerform.controls['no'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.registerform.controls['student'].setValidators([Validators.required]);//
    this.registerform.controls['date'].setValidators([Validators.required]);
    this.registerform.controls['employee'].setValidators([Validators.required]);//
    this.registerform.controls['registerstatus'].setValidators([Validators.required]);//

    Object.values(this.registerform.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.registerform.controls) {
      const control = this.registerform.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldregister != undefined && control.valid) {
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

      this.register = this.registerform.getRawValue();

      //Covert Time To SQL Time

      let regdata: string = "";

      regdata = regdata + "<br>Student id : " + this.register.no;
      regdata = regdata + "<br>To Start in : " + this.register.date;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Class Add",
          message: "Are you sure to register? <br> <br>" + regdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");

          this.rs.add(this.register).then((response: [] | undefined) => {
            if (response != undefined) { // @ts-ignore
              console.log("Add-" + response['id'] + "-" + response['url'] + "-" + (response['errors'] == ""));
              // @ts-ignore
              addstatus = response['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = response['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.registerform.reset();
              Object.values(this.registerform.controls).forEach(control => {
                control.markAsTouched();
              });
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

    for (const controlName in this.registerform.controls) {
      const control = this.registerform.controls[controlName];
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

  // btnSearchMc(): void {
  //
  //   const ssearchdata = this.ssearch.getRawValue();
  //
  //
  //   let snumber = ssearchdata.ssnumber;
  //   let name = ssearchdata.ssname;
  //   let statusid = ssearchdata.ssstatus;
  //
  //   let query = "";
  //
  //   if (snumber != null) query = query + "&number=" + snumber;
  //   if (name != null) query = query + "&name=" + name;
  //   if (statusid != null) query = query + "&statusid=" + statusid;
  //
  //   if (query != "") query = query.replace(/^./, "?")
  //
  //   this.loadTable(query);
  //
  // }
  // btnSearchClearMc(){
  //   const confirm = this.dg.open(ConfirmComponent, {
  //     width: '500px',
  //     data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
  //   });
  //
  //   confirm.afterClosed().subscribe(async result => {
  //     if (result) {
  //       this.ssearch.reset();
  //       this.loadTable("");
  //     }
  //   });
  // }

  fillForm(register: Register) {

    this.enableButtons(false,true,true);

    this.selectedrow= register;

    this.register= JSON.parse(JSON.stringify(register));

    this.oldregister = JSON.parse(JSON.stringify(register));


    //@ts-ignore
    this.register.student= this.students.find(s => s.id === this.register.student.id);
    //@ts-ignore
    this.register.batch = this.batches.find(b => b.id === this.register.batch.id);
    //@ts-ignore
    this.register.employee = this.employees.find(e => e.id === this.register.employee.id);
    //@ts-ignore
    this.register.registerstatus = this.registerstatuses.find(rt => rt.id === this.register.registerstatus.id);

    this.registerform.patchValue(this.register);
    this.registerform.markAsPristine();

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.registerform.controls) {
      const control = this.registerform.controls[controlName];
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
        data: {heading: "Errors - Register Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Register Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.register = this.registerform.getRawValue();
            this.register.id = this.oldregister.id;

            this.rs.update(this.register).then((response: [] | undefined) => {
              if (response != undefined) { // @ts-ignore
                updstatus = response['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = response['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.registerform.reset();
                Object.values(this.registerform.controls).forEach(control => { control.markAsTouched(); });
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
          data: {heading: "Confirmation - Register Updated", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Registration delete",
        message: "Are you sure to Delete folowing Registration? <br> <br>" + this.register.no
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.rs.delete(this.register.id).then((response: [] | undefined) => {

          if (response != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = response['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.registerform.reset();
            Object.values(this.registerform.controls).forEach(control => { control.markAsTouched(); });
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Registration Unsuccessful ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

}
