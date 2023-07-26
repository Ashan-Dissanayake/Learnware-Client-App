import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Coursestatus} from "../entity/coursestatus";

@Injectable({
  providedIn: 'root'
})
export class CoursestatusService {

 constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Coursestatus>> {
    const coursestatus = await this.http.get<Array<Coursestatus>>('http://localhost:8080/coursestatus/list').toPromise();
    if(coursestatus == undefined){
      return [];
    }
    return coursestatus;
  }


}
