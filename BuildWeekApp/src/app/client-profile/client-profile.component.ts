import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ilogin } from '../models/ilogin';
import { Post } from '../models/post';
import { User } from '../models/user';
import { CommentService } from '../services/comment.service';
import { PostService } from '../services/post.service';
import { UserAuthService } from '../services/user-auth.service';
import { UserService } from '../services/user.service';
import { Comment } from '../models/comment';
import { Ifriendrequest } from '../models/ifriendrequest';
import { faComment, faTrash, faPenAlt, faCommentAlt, faHeart } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss'],
})
export class ClientProfileComponent implements OnInit {
  currentUser: User = new User('', '', new Date(), '');
  isVisible = false;
  form!: FormGroup;
  posts: Post[] = [];
  currentPost: Post = new Post('', '');
  formAction: string = 'create';
  paramsId!: number;
  owner: boolean = false;
  allUsers: User[] = [];
  loggedUser!: User;
  errorUser: User = new User('', '', new Date(), '');
  allComments: Comment[] = [];
  commentContent!: string;
  commentAction: string = 'create';
  currentComment: Comment = new Comment('', 0, 0, new Date());

  faComment = faComment
  faTrash=faTrash
  faPenAlt = faPenAlt
  faCommentAlt = faCommentAlt
  faHeart = faHeart

  constructor(
    private userSrv: UserService,
    private auth: UserAuthService,
    private router: Router,
    private postSvc: PostService,
    private activeRouter: ActivatedRoute,
    private commentSvc: CommentService
  ) {
    this.router.events.subscribe((e) => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.loggedUser = this.auth.getLoggedUser();

    this.paramsId = Number(this.activeRouter.snapshot.paramMap.get('id'));
    this.userSrv.getAllUsers().subscribe((r) => (this.allUsers = r));

    this.checkOwner();

    this.userSrv.getUserById(String(this.paramsId)).subscribe({
      next: (res) => {
        this.currentUser = res;
      },
      error: () => (this.currentUser = this.errorUser),
    });

    this.postSvc.getAllPosts().subscribe({
      next: (res) =>
        (this.posts = res.filter((post) => post.userId == this.paramsId)),
      error: (error) => console.log(error),
    });
  }

  checkOwner(): void {
    if (this.loggedUser.id) {
      this.paramsId == this.loggedUser.id
        ? (this.owner = true)
        : (this.owner = false);
    }
  }

  editUser(): void {
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

  saveProfileData(): void {
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

  deleteUser(): void {
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
      let index: number = this.posts.findIndex((p) => p.id === post.id);
      this.posts.splice(index, 1);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Post Deleated',
        showConfirmButton: false,
        timer: 2000,
      });
    });
  }

  addPost(post: Post): void {
    post.userId = this.currentUser?.id;
    post.dateOfPublish = new Date();
    this.postSvc.addPost(post).subscribe((res) => {
      this.posts.push(res);
      this.currentPost = new Post('', '');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'New Post Created',
        showConfirmButton: false,
        timer: 2000,
      });
    });
  }

  editPost(post: Post): void {
    console.log(post);
    this.postSvc.editPost(post).subscribe((res) => {
      let index = this.posts.findIndex((todo: Post) => todo.id == res.id);
      this.posts.splice(index, 1, post);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Post Edited',
        showConfirmButton: false,
        timer: 2000,
      });
    });
  }

  addToEdit(todo: Post): void {
    todo = Object.assign({}, todo);
    this.currentPost = todo;
    this.formAction = 'edit';
  }

  addLike(post: Post): void {
    if (post.id && this.currentUser?.id) {
      let heart: number = this.currentUser.id;
      if (post.likes.includes(heart)) {
        post.likes = post.likes.filter((n) => n != heart);
        this.postSvc.editPost(post).subscribe(() => {});
      } else {
        post.likes.push(heart);
        this.postSvc.editPost(post).subscribe(() => {});
      }
    }
  }

  allLikes(post: Post): number {
    let i = 0;
    for (let l of post.likes) {
      i++;
    }
    return i;
  }

  openedCom: Post[] = [];

  openContent(post: Post) {
    this.commentSvc
      .getCommentOfPost(post)
      .subscribe((comments) => (this.allComments = comments));
    this.openedCom.push(post);
    console.log(this.openedCom);

    /* LOGICA COMMENTI APERTI */
    if (this.openedCom.length > 1 && this.openedCom[0] !== this.openedCom[1]) {
      this.openedCom[0].commentCollapsed = false;
      this.openedCom.shift();
      console.log(this.openedCom);
    }
    if (this.openedCom[0] == this.openedCom[1]) {
      this.openedCom = [];
    }
    post.commentCollapsed = !post.commentCollapsed;
  }

  findAuthor(id: number | undefined): User {

    let author = this.allUsers.find((user: User) => user.id == id)
    if (author)
    return author
    else return this.errorUser
  }

  createComment(commentContent: string, post: Post) {
    if (this.currentUser && this.currentUser.id && post.id) {
      let comment = new Comment(commentContent, this.currentUser.id, post.id);
      this.commentSvc
        .addComment(comment)
        .subscribe((comment) => this.allComments.push(comment));
      this.commentContent = '';
    }
  }

  deleteComment(comment: Comment): void {
    this.commentSvc.deleteComment(comment).subscribe(() => {
      this.allComments = this.allComments.filter((n) => n.id != comment.id);
    });
  }

  editComment(comment: Comment): void {
    comment.content = this.commentContent;
    this.commentSvc.editComment(comment).subscribe((comment) => {
      let index = this.allComments.findIndex(
        (c: Comment) => c.id == comment.id
      );
      this.allComments.splice(index, 1, comment);
    });
    this.commentAction = 'create';
  }

  addCommentToEdit(comment: Comment): void {
    comment = Object.assign({}, comment);
    console.log(this.currentComment);
    this.commentContent = comment.content;
    this.currentComment.id = comment.id;
    this.currentComment.postId = comment.postId;
    this.currentComment.userId = comment.userId;
    this.currentComment.dateOfPublish = comment.dateOfPublish;
    this.commentAction = 'edit';
  }

  timeElapsed(past: Date): string {
    let today: string = String(new Date());
    console.log(past);
    let pastTimeNum = Date.parse(String(past));
    let todayTimeNum = Date.parse(today);
    console.log(past);

    let elapsed: any = (todayTimeNum - pastTimeNum) / (1000 * 60 * 60 * 24);
    console.log(elapsed);

    /* CALOCO TEMPO PASSATO DALLA DATA DI PUBLICAZIONE */
    if (elapsed < 1 / (60 * 24)) return 'just right now';
    if (elapsed < 1 / 24)
      return `${(elapsed * (60 * 24)).toFixed(0)} minutes ago`;
    if (elapsed < 1) return `${(elapsed * 24).toFixed(0)} hours ago`;
    if (elapsed < 31) return `${elapsed.toFixed(0)} days ago`;
    if (elapsed > 365) return `${(elapsed / 365).toFixed(0)} years ago`;
    if (elapsed > 62) return `${(elapsed / 30).toFixed(0)} months ago`;
    else return 'popi popi';
  }

  // Friend / Notifications

  social: {
    friend: string;
    message: string;
    like: string;
  } = {
    friend: 'sent you a friend request',
    message: 'has commented your post',
    like: 'has liked your post',
  };

  sendRequest(user: User) {
    console.log(user.notifications);
    if (this.currentUser.id && user.id) {
      let friendRequest: Ifriendrequest = {
        fromUserId: this.currentUser.id,
        toUserId: user.id,
        status: 2,
      };
      user.notifications.push(friendRequest);
      this.userSrv.editUser(user, user.id).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'request sent',
          showConfirmButton: false,
          timer: 2000,
        });
      });
    }
  }

  findIndexStatus(currentUser: User) {
    let arrNoti: Ifriendrequest[] = currentUser.notifications;
    console.log(arrNoti);

    let indexNoti: Ifriendrequest | undefined = arrNoti.find(
      (e) => e.fromUserId == this.loggedUser.id
    );
    if (indexNoti) console.log(currentUser);
    console.log(this.loggedUser);
    console.log(indexNoti);

    if (indexNoti?.status == -1) return 1;
    else return indexNoti?.status;
  }

  deleteRequest(currentUser: User) {
    let actualNoti: Ifriendrequest | undefined = currentUser.notifications.find(
      (e) => e.fromUserId == this.loggedUser.id
    );
    if (actualNoti) {
      let indexNoti: number = currentUser.notifications.indexOf(actualNoti);
      currentUser.notifications.splice(indexNoti, 1);
      if (currentUser.id)
      this.userSrv.editUser(currentUser, currentUser.id);
    }
  }

  addToFriends() {}
}
