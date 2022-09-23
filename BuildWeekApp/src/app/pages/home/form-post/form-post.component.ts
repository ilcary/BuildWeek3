import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss']
})
export class FormPostComponent implements OnInit {

  editPost(): void {
    this.onEditPost.emit(this.currentPost)
    this.refreshInput()
  }

  sendPost(): void {
   this.onNewPostCreated.emit(this.currentPost);
   this.refreshInput()
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
