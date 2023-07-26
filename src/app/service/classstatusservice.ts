import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../entity/course";
import {Classstatus} from "../entity/Classstatus";

@Injectable({
  providedIn: 'root'
})
export class ClassstatusService {

 constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Classstatus>> {
    const classstatuses = await this.http.get<Array<Classstatus>>('http://localhost:8080/classstatus').toPromise();
    if(classstatuses == undefined){
      return [];
    }
    return classstatuses;
  }

}
