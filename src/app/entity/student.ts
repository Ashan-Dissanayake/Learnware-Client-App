import {Gender} from "./gender";
import {Designation} from "./designation";
import {Employeestatus} from "./employeestatus";
import {Studentstatus} from "./studentstatus";
import {Guardiantype} from "./guardiantype";

export class Student {

  public id !: number;

  public fullname !: string;

  public name !: string;

  public callingname !: string;

  public address !: string;

  public phoneno !: string;

  public dob !: string;

  public gaurdianname !: string;

  public emergencyno !: string;

  public description !: string;

  public doregisterd !: string;

  public gaurdiantype !: Guardiantype;

  public studentstatus!: Studentstatus;

  constructor(id:number, fullname:string, name:string, callingname:string,
              address:string, phoneno:string, dob:string, gaurdianname:string, emergencyno:string,
              description:string, doregisterd:string, gaurdiantype:Guardiantype, studentstatus:Studentstatus ) {
   this.id = id;
   this.fullname = fullname;
   this.name = name;
   this.callingname = callingname;
   this.address = address;
   this.phoneno = phoneno;
   this.dob = dob;
   this.address = address;
   this.gaurdianname = gaurdianname;
   this.emergencyno = emergencyno;
   this.description = description;
   this.description = description;
   this.doregisterd = doregisterd;
   this.gaurdiantype = gaurdiantype;
   this.studentstatus = studentstatus;
  }
}
