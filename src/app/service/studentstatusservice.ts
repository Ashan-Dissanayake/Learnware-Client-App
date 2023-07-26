import {Employeestatus} from "../entity/employeestatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Studentstatus} from "../entity/studentstatus";

@Injectable({
  providedIn: 'root'
})
export class StudentstatusService {

 constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Studentstatus>> {
    const studentstatuses = await this.http.get<Array<Studentstatus>>('http://localhost:8080/studentstatuses/list').toPromise();
    if(studentstatuses == undefined){
      return [];
    }
    return studentstatuses;
  }


}
