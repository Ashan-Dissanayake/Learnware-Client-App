export class Coursereg {

  public no!: number;
  public coursename !: string;
  public prevyearreg !: number;
  public currentyearreg !: number;

  constructor(no:number, coursename:string,currentyearreg:number,prevyearreg:number) {

    this.no =no;
    this.coursename=coursename;
    this.prevyearreg=prevyearreg;
    this.currentyearreg=currentyearreg;

  }

}
