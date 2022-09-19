import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { UserAuthService } from './services/user-auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'BuildWeekApp';
  client!:User
  logged!: boolean


  constructor(private userSrv: UserService, private auth: UserAuthService, private router : Router){}

  ngOnInit(): void {


    this.router.events.subscribe(()=> this.checkForActualUser())


  }

  checkForActualUser():void{
    this.logged  = this.auth.isUserLogged()
   console.log(this.logged);
   console.log(this.auth.isUserLogged());

    if(this.logged)
    this.client = this.auth.getLoggedUser()
  }



  logOut(){
    this.auth.logOut()
    this.checkForActualUser()
  }

}
