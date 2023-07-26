import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Classreview} from "../entity/classreview";

@Injectable({
  providedIn: 'root'
})
export class ClassreviewService{

  constructor(private http: HttpClient) {  }

  async delete(username: string): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/classreviews' + username).toPromise();
  }

  async update(user: Classreview): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/classreviews', user).toPromise();
  }

  async getAll(query:string): Promise<Array<Classreview>> {
    const classreview = await this.http.get<Array<Classreview>>('http://localhost:8080/classreviews'+query).toPromise();
    if(classreview == undefined){
      return [];
    }
    return classreview;
  }

  async add(user: Classreview): Promise<[]|undefined>{
    console.log(user);
    return this.http.post<[]>('http://localhost:8080/classreviews', user).toPromise();
  }

}
