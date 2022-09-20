import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthResponse } from '../models/auth-response';
import { ilogin } from '../models/ilogin';
import { Post } from '../models/post';
import { User } from '../models/user';
import { PostService } from '../services/post.service';
import { UserAuthService } from '../services/user-auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss'],
})
export class ClientProfileComponent implements OnInit {
  currentUser!: User
  isVisible = false;
  form!: FormGroup;
  posts: Post[] = [];
  currentPost: Post = new Post('', '');
  formAction: string = 'create'
  paramsId!: number
  owner!:boolean
  allUsers:User[] = [];
  loggedUser!:User

  constructor(
    private userSrv: UserService,
    private auth: UserAuthService,
    private router: Router,
    private postSvc:PostService,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loggedUser = this.auth.getLoggedUser()
    this.paramsId = Number(this.activeRouter.snapshot.paramMap.get('id'))
    this.userSrv.getAllUsers().subscribe(r=>this.allUsers=r)
    this.currentUser = this.auth.getLoggedUser()
    this.checkOwner()
    this.postSvc.getAllPosts().subscribe(
      {
        next: res => {
          this.posts = res;
        },
        error: error => console.log(error)
      }
    )
  }


  checkOwner(){
    this.paramsId == this.currentUser.id ? this.owner=true : this.owner=false
  }

  editUser() {
    this.form = new FormGroup({
      name: new FormControl(this.currentUser.name, Validators.required),
      email: new FormControl(this.currentUser.email, Validators.required),
      btd: new FormControl(this.currentUser.btd, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.isVisible = true;
    // al save  this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  saveProfileData() {
    if (this.currentUser.id)
      this.userSrv.editUser(this.form.value, this.currentUser.id).subscribe({
        next: (user) => {
          this.isVisible = false;
          this.currentUser = user;
          let regdata: ilogin = {
            email: this.currentUser.email,
            password: this.form.value.password,
          };
          this.auth.login(regdata).subscribe((res) => {
            this.auth.saveAccessData(res);
            console.log(`sei dentro boyyy ${res.user.email}`);
          });
          Swal.fire({
            icon: 'success',
            title: `The user ${user.name} has correctly been updated!`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Password errata!',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
  }

  deleteUser() {
    Swal.fire({
      title: 'warning!',
      text: "You won't be able to revert this!",
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.userSrv.deleteUser(this.currentUser).subscribe((user) => {
          Swal.fire({
            title: 'Success!',
            text: user.name + 'has been deleted',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then(() => {
            this.auth.logOut();
            this.router.navigate(['/']);
          });
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'User not deleted',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });
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

}
