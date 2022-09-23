import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth-response';
import { ilogin } from '../models/ilogin';
import { Iregister } from '../models/iregister';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor( private http:HttpClient) { }

  api_UserUrl:string = "http://localhost:3000"


  register(registerData:Iregister){
    return this.http.post<AuthResponse>(this.api_UserUrl+'/register', registerData)
  }

  login(loginData:ilogin){
    console.log(loginData);

    return this.http.post<AuthResponse>(this.api_UserUrl+'/login', loginData)
  }

  isUserLogged():boolean{
    return localStorage.getItem('access') != null
  }

  getLoggedUser():User{
    let db = localStorage.getItem('access')
    return db ? JSON.parse(db).user : null
  }
  getAccessToken():string{
    let db = localStorage.getItem('access')
    console.log(db);
    return db ? JSON.parse(db).accessToken : null
  }

  saveAccessData(data:AuthResponse):void{
    localStorage.setItem('access',JSON.stringify(data))
  }

  logOut(): void{
    localStorage.removeItem('access')
  }

}
