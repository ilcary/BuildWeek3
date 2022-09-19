import { Component, OnInit } from '@angular/core';
import { like } from 'src/app/models/Ilike';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentPost: Post = new Post('', '');
  currentUser!: User | null
  formAction: string = 'create'


  apiUrl: string = 'http://localhost:3000/posts'

  constructor(private postSvc: PostService, private authSvc: UserAuthService) { }

  posts: Post[] = [];

  ngOnInit(): void {
    this.currentUser = this.authSvc.getLoggedUser()
    console.log(this.currentUser);

    this.postSvc.getAllPosts().subscribe(
      {
        next: res => {
          this.posts = res;
        },
        error: error => console.log(error)
      }
    )
  }

  deletePost(post: Post): void {
    this.postSvc.deletePost(post).subscribe(() => {
      let index: number = this.posts.findIndex(p => p.id === post.id)
      this.posts.splice(index, 1);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Post Deleated',
        showConfirmButton: false,
        timer: 2000
      })
    })
  }

  addPost(post: Post): void {
    post.userId = this.currentUser?.id
    post.dateOfPublish = new Date()
    this.postSvc.addPost(post).subscribe(res => {
      this.posts.push(res)
      this.currentPost = new Post('', '')
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'New Post Created',
        showConfirmButton: false,
        timer: 2000
      })
    })
  }

  editPost(post: Post) {
    console.log(post);
    this.postSvc.editPost(post).subscribe(res => {
      let index = this.posts.findIndex((todo: Post) => todo.id == res.id)
      this.posts.splice(index, 1, post)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Post Edited',
        showConfirmButton: false,
        timer: 2000
      })
    })
  }

  addToEdit(todo: Post): void {
    todo = Object.assign({}, todo)
    this.currentPost = todo
    this.formAction = 'edit'
  }

  addLike(post:Post){
    if(post.id && this.currentUser?.id){
      let heart:like = new like (post.id,this.currentUser.id)
      this.postSvc.getPostById(post.id).subscribe(res =>{
       let allLike:like[] = res.likes
        let match = allLike.filter(e => e == heart)
        console.log(heart);
        console.log(match);
        console.log(allLike);

        if(match.length !== 0 || allLike.length == 0){
          post.likes.push(heart)
          this.postSvc.editPost(post).subscribe(res => {
          let index = this.posts.findIndex((post: Post) => post.id == res.id)
          this.posts.splice(index, 1, post)
        })
      }else{
            console.log(post.likes);
console.log();

             let index = post.likes.indexOf(heart)
             console.log(heart);
             console.log(index);

             post.likes.slice(index,1)
             this.postSvc.editPost(post).subscribe(res => {
             let index = this.posts.findIndex((post: Post) => post.id == res.id)
             this.posts.splice(index, 1, post)
              })
            }

     }
 ) }
}

  allLikes(post:Post):number{
    let i = 0
    for(let l of post.likes){
      i++
    }
    return i
  }

}
