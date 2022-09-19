import { ilogin } from "./ilogin";

export class User implements ilogin {
  id:number|undefined;
  name: string;
  email: string;
  btd: Date
  password: string;

  constructor(name:string, email:string, btd:Date, password:string){
    this.name = name
    this.email = email
    this.btd = btd
    this.password = password
  }
}
