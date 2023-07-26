import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Devision} from "../entity/devision";

@Injectable({
  providedIn: 'root'
})
export class DevisionService {

 constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Devision>> {
    const devisions = await this.http.get<Array<Devision>>('http://localhost:8080/divisions/list').toPromise();
    if(devisions == undefined){
      return [];
    }
    return devisions;
  }


}
