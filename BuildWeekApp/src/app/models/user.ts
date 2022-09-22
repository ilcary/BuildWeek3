import { ilogin } from "./ilogin";

export class User implements ilogin {
  id:number|undefined;
  name: string;
  email: string;
  btd: Date
  password: string;
  friends: number[] = []
  notifications: any[] 

  constructor(name:string, email:string, btd:Date, password:string,notifications: any[] = [] ){
    this.name = name
    this.email = email
    this.btd = btd
    this.password = password
    this.notifications = notifications
  }
}
