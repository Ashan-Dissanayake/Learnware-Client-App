import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../entity/course";
import {Class} from "../entity/Class";
import {Register} from "../entity/Register";

@Injectable({
  providedIn: 'root'
})
export class Registerservice {

 constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Register>> {
    console.log(query);
    const registers = await this.http.get<Array<Register>>('http://localhost:8080/registers'+ query).toPromise();
    if(registers == undefined){
      return [];
    }
    return registers;
  }

  async add(register:Register): Promise<[]|undefined> {
    return  this.http.post<[]>('http://localhost:8080/registers', register).toPromise();
 }

  async update(register: Register): Promise<[] | undefined>{
    return this.http.put<[]>('http://localhost:8080/registers',register).toPromise();
  }

  async delete(id:number): Promise<[]|undefined> {
    return  this.http.delete<[]>('http://localhost:8080/registers/' + id).toPromise();
  }
}
