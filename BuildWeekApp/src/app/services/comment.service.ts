import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  api_CommentUrl:string = "http://localhost:3000/comments/"

  constructor(private http: HttpClient) { }



  getAllComments():Observable<Comment[]>{
    return this.http.get<Comment[]>(this.api_CommentUrl)
  }

/*
  getCommentById(id:number):Observable<Comment>{
    return this.http.get<Comment>(this.api_CommentUrl +id)
  } */

  addComment(Comment:Comment):Observable<Comment>{
    return this.http.post<Comment>(this.api_CommentUrl, Comment)
  }

  getCommentOfPost(post:Post):Observable<Comment[]>{
    return this.http.get<Comment[]>(this.api_CommentUrl+ '/?postId='+post.id)
  }


  editComment(Comment:Comment):Observable<Comment>{
    return this.http.patch<Comment>(this.api_CommentUrl + Comment.id, Comment)
  }


  deleteComment(Comment:Comment):Observable<Comment>{
    return this.http.delete<Comment>(this.api_CommentUrl + Comment.id)
  }
}
