import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { faMagnifyingGlass, faComment, faTrash, faPenAlt, faCommentAlt, faHeart } from '@fortawesome/free-solid-svg-icons'
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../models/comment';

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
  searched!:string
  searchedUsers: User[] = []
  allComments: Comment[] = []
  commentContent!:string
  commentAction: string = 'create'
  currentComment: Comment = new Comment('',0,0,new Date())
  errorUser: User = new User('', '', new Date(), '');

  faMagnifyingGlass=faMagnifyingGlass
  faComment = faComment
  faTrash=faTrash
  faPenAlt = faPenAlt
  faCommentAlt = faCommentAlt
  faHeart = faHeart

  apiUrl: string = 'http://localhost:3000/posts'

  constructor(
    private postSvc: PostService,
    private authSvc: UserAuthService,
    private userSvc : UserService,
    private router:Router,
    private commentSvc: CommentService
    ) { }

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
    this.commentSvc.getAllComments().subscribe(res => this.allComments = res )

  }

  findAuthor(id: number | undefined): User {

    let author = this.userList.find((user: User) => user.id == id)
    if (author)
    return author
    else return this.errorUser
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
      this.formAction = 'create'
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
      this.router.navigate(['/profile/' + id])
    }
  }


  listOfSelectedValue: string[] = [];

  isNotSelected(value: string): boolean {
    return this.listOfSelectedValue.indexOf(value) === -1;
  }

  filterOptionUser(searched:string){
    if(searched.length !== 0){
    let search:string = searched.toLowerCase()
   this.searchedUsers = this.userList.filter(user => user.name.toLowerCase().includes(search))
  }else{
    this.searchedUsers=[]
  }
}

comment(post:Post){}

openedCom:Post[]=[]

openContent(post:Post){
  this.commentSvc.getCommentOfPost(post).subscribe(comments => this.allComments = comments)
  this.openedCom.push(post)
  console.log(this.openedCom);

  /* LOGICA COMMENTI APERTI */
  if( this.openedCom.length > 1 && this.openedCom[0]!==this.openedCom[1]){
    this.openedCom[0].commentCollapsed = false
    this.openedCom.shift()
    console.log(this.openedCom);
  }
  if(this.openedCom[0]==this.openedCom[1]){
    this.openedCom=[]
  }
  post.commentCollapsed= !post.commentCollapsed

}


createComment( commentContent:string, post:Post){
  if(this.currentUser && this.currentUser.id && post.id){
   let comment = new Comment(commentContent,this.currentUser.id,post.id)
    this.commentSvc.addComment(comment).subscribe(comment => this.allComments.push(comment))
    this.commentContent=''
  }
}

deleteComment(comment: Comment):void{
  this.commentSvc.deleteComment(comment).subscribe( () => {
    this.allComments = this.allComments.filter(n => n.id != comment.id)
  })
}

editComment(comment:Comment):void{
  comment.content = this.commentContent
  this.commentSvc.editComment(comment).subscribe( comment =>{
    let index = this.allComments.findIndex((c:Comment) => c.id == comment.id)
      this.allComments.splice(index, 1, comment)
  })
  this.commentAction = 'create'
}

addCommentToEdit(comment: Comment): void {
  comment = Object.assign({}, comment)
  console.log(this.currentComment)
    this.commentContent = comment.content
    this.currentComment.id = comment.id
    this.currentComment.postId = comment.postId
    this.currentComment.userId = comment.userId
    this.currentComment.dateOfPublish = comment.dateOfPublish
    this.commentAction = 'edit'
}

timeElapsed(past: Date):string{
  let today:string = String(new Date())
  let pastTimeNum= Date.parse(String(past))
  let todayTimeNum= Date.parse(today)
  let elapsed:any = (todayTimeNum - pastTimeNum)/(1000*60*60*24)

  /* CALOCO TEMPO PASSATO DALLA DATA DI PUBLICAZIONE */
  if(elapsed < 1/(60*24))
  return 'just right now'
  if(elapsed < 1/24)
  return `${(elapsed*(60*24)).toFixed(0)} minutes ago`
  if(elapsed < 1)
  return `${(elapsed*24).toFixed(0)} hours ago`
  if(elapsed < 31)
  return `${(elapsed).toFixed(0)} days ago`
  if(elapsed > 365)
  return `${(elapsed/365).toFixed(0)} years ago`
  if(elapsed > 62)
  return `${(elapsed/30).toFixed(0)} months ago`
  else return 'popi popi'
}




}
