import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../entity/course";
import {Class} from "../entity/Class";
import {Student} from "../entity/student";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

 constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Student>> {
    const students = await this.http.get<Array<Student>>('http://localhost:8080/students'+ query).toPromise();
    if(students == undefined){
      return [];
    }
    return students;
  }

  async add(student:Student): Promise<[]|undefined> {
    return  this.http.post<[]>('http://localhost:8080/students', student).toPromise();
 }

  async update(student:Student): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/students',student).toPromise();
  }

  async delete(id:number): Promise<[]|undefined> {
    return  this.http.delete<[]>('http://localhost:8080/students/' + id).toPromise();
  }


}
