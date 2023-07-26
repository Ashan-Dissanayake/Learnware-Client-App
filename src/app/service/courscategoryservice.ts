import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Coursecategory} from "../entity/coursecategory";

@Injectable({
  providedIn: 'root'
})
export class CourscategoryService {

 constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Coursecategory>> {
    const coursecategory = await this.http.get<Array<Coursecategory>>('http://localhost:8080/coursecategory/list').toPromise();
    if(coursecategory == undefined){
      return [];
    }
    return coursecategory;
  }


}
