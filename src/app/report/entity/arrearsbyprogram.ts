export class ArrearsByProgram {

  public program!: string;
  public count!: number;
  public expected!: number;
  public paid!: number;
  public due!: number;
  public arrears!: number;
  public percentage!: number;

  constructor(program:string ,count:number,expected:number,paid:number,due:number,arrears:number,percentage:number) {

    this.program=program;
    this.count=count;
    this.expected=expected;
    this.paid=paid;
    this.due=due;
    this.arrears = arrears;
    this.percentage = percentage;
  }

}
