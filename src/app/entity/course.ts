import {Gender} from "./gender";
import {Designation} from "./designation";
import {Employeestatus} from "./employeestatus";
import {Coursecategory} from "./coursecategory";
import {Employee} from "./employee";
import {Coursestatus} from "./coursestatus";
import {Devision} from "./devision";

export class Course {

  public id !: number;

  public coursecategory !: Coursecategory;

  public division ! : Devision;

  public code !: string;

  public name !: string;

  public description !: string;

  public dointroduced !: string;

  public credit !: number;

  public fee !: number;

  public durationtheory !: number;

  public durationpractical !: number;

  public cordinator : Employee;

  public deputycordinator : Employee;

  public coursestatus !: Coursestatus;


  constructor(id:number, coursecategory:Coursecategory, division:Devision, code:string, name:string,
              description:string, dointroduced:string, credit:number, fee:number, durationtheory:number,
              durationpractical:number, cordinator:Employee, deputycordinator:Employee, coursestatus:Coursestatus,
              ) {
   this.id = id;
   this.coursecategory = coursecategory;
   this.division = division;
   this.code = code;
   this.name = name;
   this.description = description;
   this.dointroduced = dointroduced;
   this.credit = credit;
   this.fee = fee;
   this.durationtheory = durationtheory;
   this.durationpractical = durationpractical;
   this.cordinator = cordinator;
   this.deputycordinator = deputycordinator;
   this.description = description;
   this.coursestatus = coursestatus;
  }
}
