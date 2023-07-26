import {Gender} from "./gender";
import {Designation} from "./designation";
import {Employeestatus} from "./employeestatus";
import {Coursecategory} from "./coursecategory";
import {Employee} from "./employee";
import {Coursestatus} from "./coursestatus";
import {Devision} from "./devision";
import {Course} from "./course";

export class Lesson {

  public id !: number;

  public name !: string;

  public cource !: Course;


  constructor(id:number,name:string,cource:Course) {
   this.id = id;
   this.name = name;
   this.cource = cource;

  }
}
