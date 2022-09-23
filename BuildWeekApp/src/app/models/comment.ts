import { IComment } from "./icomment";

export class Comment implements IComment {
  id: number | undefined;
  content: string;
  userId: number;
  postId: number;
  dateOfPublish: Date;

  constructor(content:string,userId:number, postId:number, dateOfPublish:Date=new Date()){
    this.content = content;
    this.userId = userId;
    this.postId = postId;
    this.dateOfPublish = dateOfPublish
  }
}
