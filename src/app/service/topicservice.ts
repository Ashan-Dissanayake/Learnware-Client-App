import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Topic} from "../entity/topic";

@Injectable({
  providedIn: 'root'
})
export class Topicservice{

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Topic>> {

    const topics = await this.http.get<Array<Topic>>('http://localhost:8080/topics/list').toPromise();
    if(topics == undefined){
      return [];
    }
    return topics;
  }


}
