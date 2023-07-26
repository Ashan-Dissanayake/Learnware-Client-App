
import {Employee} from "./employee";
import {Lesson} from "./lesson";
import {Batch} from "./batch";
import {Registerstatus} from "./registerstatus";
import {Student} from "./student";

export class Register {

  public id !: number;

  public no !: number;

  public date !: string;

  public registerstatus !: Registerstatus;

  public batch !: Batch;

  public Student !: Student;

  public employee !: Employee;


  constructor(id:number,no:number,date:string,registerstatus:Registerstatus,
              batch:Batch,student:Student, employee:Employee) {

    this.id = id;
    this.no = no;
    this.date=date;
    this.Student=student;
    this.batch = batch;
    this.registerstatus=registerstatus;
    this.employee = employee;

  }
}
