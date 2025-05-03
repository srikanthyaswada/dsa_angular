import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'http://localhost:5000/api/registration';

  constructor(private http: HttpClient) {}

  submitRegistration(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
