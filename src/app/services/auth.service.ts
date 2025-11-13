import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface logiRequest{
  usuario: string,
  contraseña: string;
}

export interface loginResponse{
  bandera: boolean,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:6542/api';
  private tokenKey = 'auth_token';

  constructor(private http:HttpClient, private router: Router) { }

  async login(credentials:logiRequest):Promise<loginResponse>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    try {
      let response = await this.http.post<loginResponse>(
        this.apiUrl + "/login",
        credentials,
        {headers}
      ).toPromise();
  
      if (response) {
        if (response.token != null || response.token != '') {
          localStorage.setItem(this.tokenKey, response.token);
          return response;         
        }
        else{
          return response;
        }
      }
      throw new Error("Bad Response");
    } catch (error) {
      throw error;
    }
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null  {
    return localStorage.getItem(this.tokenKey);
  }

  isauthenticated(): boolean{
    return !!this.getToken()
  }
}
