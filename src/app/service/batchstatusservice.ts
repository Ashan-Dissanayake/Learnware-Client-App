import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Coursestatus} from "../entity/coursestatus";
import {Batchstatus} from "../entity/batchstatus";

@Injectable({
  providedIn: 'root'
})
export class Batchstatusservice {


  constructor(private http: HttpClient) { }


  async getAllList(): Promise<Array<Batchstatus>> {
    const batchstatuses = await this.http.get<Array<Batchstatus>>('http://localhost:8080/batchstatuses/list').toPromise();
    if(batchstatuses == undefined){
      return [];
    }
    return batchstatuses;
  }


}
