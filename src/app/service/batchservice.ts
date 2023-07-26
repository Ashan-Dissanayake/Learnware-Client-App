import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Batch} from "../entity/batch";

@Injectable({
  providedIn: 'root'
})
export class Batchservice {

  constructor(private http: HttpClient) { }



  async getAll(query:string): Promise<Array<Batch>> {
    console.log(query);
    const batches = await this.http.get<Array<Batch>>('http://localhost:8080/batches'+query).toPromise();
    if(batches == undefined){
      return [];

    }
    return batches;
  }

  async getAllListNameId(): Promise<Array<Batch>> {
    const batches = await this.http.get<Array<Batch>>('http://localhost:8080/batches/list').toPromise();
    if(batches == undefined){
      return [];
    }
    return batches;
  }



  async add(batch:Batch): Promise<[]|undefined> {
    // employee.number='43567';
    return  this.http.post<[]>('http://localhost:8080/batches',batch).toPromise();

  }

  async update(batch:Batch): Promise<[]|undefined> {
    return  this.http.put<[]>('http://localhost:8080/batches', batch).toPromise();
  }

  async delete(id:number): Promise<[]|undefined> {
    return  this.http.delete<[]>('http://localhost:8080/batches/' + id).toPromise();
  }


}
