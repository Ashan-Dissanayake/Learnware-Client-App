import {Employeestatus} from "../entity/employeestatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Studentstatus} from "../entity/studentstatus";
import {Guardiantype} from "../entity/guardiantype";

@Injectable({
  providedIn: 'root'
})
export class GuardiantypeService {

 constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Guardiantype>> {
    const Guardiantypes = await this.http.get<Array<Guardiantype>>('http://localhost:8080/guardiantypes/list').toPromise();
    if(Guardiantypes == undefined){
      return [];
    }
    return Guardiantypes;
  }


}
