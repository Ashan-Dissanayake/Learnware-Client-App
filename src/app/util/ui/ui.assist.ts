
export class UiAssist{

  component:any;

  constructor(com:any) {
    this.component = com;
  }

  getProperty(element: {},reference: string): string {

    if (!reference.endsWith("()")) {
      const value = reference.split('.').reduce( (o, a) =>{
        // @ts-ignore
        if(o!=null)
        { // @ts-ignore
          return o[a];
        }
        else return "--";
      }, element) as string;
      return value;
    }
    else {
      reference = reference.substring(0,reference.indexOf('('));
      // @ts-ignore
      return this.component[reference](element);
    }

  }


}
