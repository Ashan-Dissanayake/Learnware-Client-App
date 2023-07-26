import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Userstatus} from "../entity/userstatus";

@Injectable({
  providedIn: 'root'
})

export class RegisterstatusService{

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Userstatus>> {

    const userstatuses = await this.http.get<Array<Userstatus>>('http://localhost:8080/registrationstatuses/list').toPromise();
    if(userstatuses == undefined){
      return [];
    }
    return userstatuses;
  }

}
