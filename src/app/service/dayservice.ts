import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Coursestatus} from "../entity/coursestatus";
import {Batchstatus} from "../entity/batchstatus";
import {Day} from "../entity/day";

@Injectable({
  providedIn: 'root'
})
export class Dayservice {

  constructor(private http: HttpClient) { }


  async getAllList(): Promise<Array<Day>> {
    const days = await this.http.get<Array<Day>>('http://localhost:8080/days/list').toPromise();
    if(days == undefined){
      return [];
    }
    return days;
  }


}
