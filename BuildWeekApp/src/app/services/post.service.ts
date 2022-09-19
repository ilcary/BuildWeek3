import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  api_PostUrl:string = "http://localhost:3000/posts/"

  constructor(private http: HttpClient) { }



  getAllPosts():Observable<Post[]>{
    return this.http.get<Post[]>(this.api_PostUrl)
  }

  getPostById(id:number):Observable<Post>{
    return this.http.get<Post>(this.api_PostUrl +id)
  }

  addPost(Post:Post):Observable<Post>{
    return this.http.post<Post>(this.api_PostUrl, Post)
  }

  editPost(Post:Post):Observable<Post>{
    return this.http.patch<Post>(this.api_PostUrl + Post.id, Post)
  }

  deletePost(Post:Post):Observable<Post>{
    return this.http.delete<Post>(this.api_PostUrl + Post.id)
  }
}
