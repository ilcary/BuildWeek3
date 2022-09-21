import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';
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
  searchword!: string
  userList:User[]=[]
  strArrUsers: string[] = []


  apiUrl: string = 'http://localhost:3000/posts'

  constructor(private postSvc: PostService, private authSvc: UserAuthService, private userSvc : UserService, private router:Router) { }

  posts: Post[] = [];

  ngOnInit(): void {
    this.userSvc.getAllUsers().subscribe(res=>{
      this.userList = res
    })
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

  findAuthor(id: number | undefined): string {

    let author = this.userList.find((user: User) => user.id == id)
    if (author)
    return author.name
    else return 'unknown author'
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
      let index = this.posts.findIndex((post: Post) => post.id == res.id)
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

  addToEdit(post: Post): void {
    post = Object.assign({}, post)
    this.currentPost = post
    this.formAction = 'edit'
  }

  addLike(post: Post) {
    if (post.id && this.currentUser?.id) {
      let heart: number = this.currentUser.id
      if (post.likes.includes(heart)) {
        post.likes = post.likes.filter(n => n != heart)
        this.postSvc.editPost(post).subscribe(() =>{})
      } else {
        post.likes.push(heart)
        this.postSvc.editPost(post).subscribe(() =>{})
      }
    }
  }


  allLikes(post:Post):number{
    let i = 0
    for(let l of post.likes){
      i++
    }
    return i
  }

  select(id:number|undefined){
    if(id){
      this.router.navigate(['/users/' + id])
    }
  }


  listOfSelectedValue: string[] = [];

  isNotSelected(value: string): boolean {
    return this.listOfSelectedValue.indexOf(value) === -1;
  }


}
