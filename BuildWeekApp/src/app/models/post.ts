
import { ipost } from "./ipost";
import { User } from "./user";

export class Post implements ipost {
  id: number | undefined;
  title: string;
  content: string;
  userId: number| undefined;
  dateOfPublish: Date;
  user!:User
  likes:number[]

  constructor(title: string, content: string, likes:number[] = []) {

    this.title = title
    this.content = content
    this.dateOfPublish = new Date()
    this.likes=likes
  }

}
