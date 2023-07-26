import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) {
  }

  async post(username: string, password: string): Promise<any | undefined> {

    return this.http.post<any>("http://localhost:8080/login", {
      username: username,
      password: password,
    },{observe: 'response'}).toPromise();

  }


}
