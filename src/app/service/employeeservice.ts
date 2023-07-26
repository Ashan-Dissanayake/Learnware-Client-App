import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

 constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Employee>> {
    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees'+query).toPromise();
    if(employees == undefined){
      return [];
    }
    return employees;
  }

  async getAllListNameId(): Promise<Array<Employee>> {

    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
    if(employees == undefined){
      return [];
    }
    return employees;
  }

  async add(employee:Employee): Promise<[]|undefined> {
   // employee.number='43567';
   return  this.http.post<[]>('http://localhost:8080/employees', employee).toPromise();
  }

  async update(employee:Employee): Promise<[]|undefined> {
    return  this.http.put<[]>('http://localhost:8080/employees', employee).toPromise();
  }

  async delete(id:number): Promise<[]|undefined> {
    return  this.http.delete<[]>('http://localhost:8080/employees/' + id).toPromise();
  }

  async getFieldOfficers(): Promise<Array<Employee>> {
    const empbyFieldOfficers = await this.http.get<Array<Employee>>('http://localhost:8080/employees/byfieldofficer').toPromise();
    if (empbyFieldOfficers == undefined) {
      return [];
    }
    return empbyFieldOfficers;
  }

  async getsupervisors(): Promise<Array<Employee>> {
    const empbysupervisors = await this.http.get<Array<Employee>>('http://localhost:8080/employees/bysupervisor').toPromise();
    if (empbysupervisors == undefined) {
      return [];
    }
    return empbysupervisors;
  }


}
