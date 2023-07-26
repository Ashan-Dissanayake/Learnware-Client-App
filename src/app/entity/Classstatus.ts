import {Gender} from "./gender";
import {Designation} from "./designation";
import {Employeestatus} from "./employeestatus";
import {Coursecategory} from "./coursecategory";
import {Employee} from "./employee";
import {Coursestatus} from "./coursestatus";
import {Devision} from "./devision";
import {Course} from "./course";

export class Classstatus {

  public id !: number;

  public name !: string;

  constructor(id:number,name:string) {
   this.id = id;
   this.name = name;

  }
}
