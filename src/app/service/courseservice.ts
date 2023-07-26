import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../entity/course";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

 constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Course>> {
    console.log(query);
    const courses = await this.http.get<Array<Course>>('http://localhost:8080/courses'+query).toPromise();
    if(courses == undefined){
      return [];
    }
    return courses;
  }

  async getAllByList(query:string): Promise<Array<Course>> {
    const courses = await this.http.get<Array<Course>>('http://localhost:8080/courses/list'+query).toPromise();
    if(courses == undefined){
      return [];
    }
    return courses;
  }

  async add(course:Course): Promise<[]|undefined> {
   return  this.http.post<[]>('http://localhost:8080/courses', course).toPromise();
  }

  async update(course:Course): Promise<[]|undefined> {
    return  this.http.put<[]>('http://localhost:8080/courses', course).toPromise();
  }

  async delete(id:number): Promise<[]|undefined> {
    return  this.http.delete<[]>('http://localhost:8080/courses/' + id).toPromise();
  }

}
