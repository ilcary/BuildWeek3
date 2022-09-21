import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss']
})
export class FormPostComponent implements OnInit {

  uploadImg!:any

  editPost(): void {
    this.onEditPost.emit(this.currentPost)
    this.refreshInput()
  }

  sendPost(): void {
   this.onNewPostCreated.emit(this.currentPost);
   this.refreshInput()
   this.readFileAsDataURL(this.uploadImg)
  }

  readFileAsDataURL(file:any) {
    return new Promise((resolve,reject) => {
       let fileredr = new FileReader();
       fileredr.onload = () => resolve(fileredr.result);
       fileredr.onerror = () => reject(fileredr);
       fileredr.readAsDataURL(file);
    });
  }


  refreshInput(): void {
    this.currentPost = new Post('','')
  }

  constructor() { }

  ngOnInit(): void {
  }

  @Output() onNewPostCreated = new EventEmitter();

  @Output() onEditPost= new EventEmitter()

  @Input() currentPost!: Post
  @Input() formAction!: string
}
