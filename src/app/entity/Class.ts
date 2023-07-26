import {Gender} from "./gender";
import {Designation} from "./designation";
import {Employeestatus} from "./employeestatus";
import {Coursecategory} from "./coursecategory";
import {Employee} from "./employee";
import {Coursestatus} from "./coursestatus";
import {Devision} from "./devision";
import {Course} from "./course";
import {Lesson} from "./lesson";
import {Batch} from "./batch";

export class Class {

  public id !: number;

  public doclass !: string;

  public tostart !: string;

  public toend !: string;

  public description !: string;

  public dodefine !: string;

  public batch !: Batch;

  public lessonByLessonId !: Lesson;

  public teacher !:Employee;

  public classstatus !: Class;

  public employee !: Employee;

  constructor(value: any) {
  }


  // constructor(id:number,doclass:string,tostart:string,toend:string,description:string,
  //             dodefine:string,batch:Batch,lessonByLessonId:Lesson,teacher:Employee,
  //             classstatus:Class,employee:Employee) {
  //
  //   this.id = id;
  //   this.doclass = doclass;
  //   this.tostart = tostart;
  //   this.toend = toend;
  //   this.description = description;
  //   this.dodefine = dodefine;
  //   this.batch = batch;
  //   this.lessonByLessonId = lessonByLessonId;
  //   this.teacher = teacher;
  //   this.classstatus = classstatus;
  //   this.employee = employee;
  //
  // }
}
