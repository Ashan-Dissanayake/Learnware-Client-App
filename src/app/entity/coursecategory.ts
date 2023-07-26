import {Devision} from "./devision";

export class Coursecategory {

  public id !: number;
  public name !: string;
  public devision!: Devision;

  constructor(id: number, name: string,division:Devision) {
    this.id = id;
    this.name = name;
    this.devision = division;
  }

}
