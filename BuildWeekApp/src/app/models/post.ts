import { like } from "./Ilike";
import { ipost } from "./ipost";
import { User } from "./user";

export class Post implements ipost {
  id: number | undefined;
  title: string;
  content: string;
  userId: number| undefined;
  dateOfPublish: Date;
  user!:User
  likes:like[]

  constructor(title: string, content: string, likes:like[] = []) {

    this.title = title
    this.content = content
    this.dateOfPublish = new Date()
    this.likes=likes
  }

}
