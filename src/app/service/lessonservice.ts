import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Course} from "../entity/course";
import {Class} from "../entity/Class";
import {Lesson} from "../entity/lesson";

@Injectable({
  providedIn: 'root'
})
export class LessonService {

 constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Lesson>> {

    const lessons = await this.http.get<Array<Lesson>>('http://localhost:8080/lessons'+query).toPromise();
    if(lessons == undefined){
      return [];
    }
    return lessons;
  }

  async getAllListNameId(): Promise<Array<Lesson>> {

    const lessons = await this.http.get<Array<Lesson>>('http://localhost:8080/lessons/list').toPromise();
    if(lessons == undefined){
      return [];
    }
    return lessons;
  }

}
