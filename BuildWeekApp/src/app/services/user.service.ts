import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_UserUrl:string = "http://localhost:3000/users/"

  constructor(private http: HttpClient) { }



  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(this.api_UserUrl)
  }

  getUserById(id:string):Observable<User>{
    return this.http.get<User>(this.api_UserUrl +id)
  }

  addUser(user:User):Observable<User>{
    return this.http.post<User>(this.api_UserUrl, user)
  }

  editUser(user:User,id:number):Observable<User>{
    return this.http.patch<User>(this.api_UserUrl + id, user)
  }

  deleteUser(user:User):Observable<User>{
    return this.http.delete<User>(this.api_UserUrl + user.id)
  }



}
