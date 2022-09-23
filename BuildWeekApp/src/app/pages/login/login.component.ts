import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup

  constructor(
    private auth: UserAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null),
    })
  }

  login():void{
    this.auth.login(this.form.value)
    .subscribe(res => {
      this.auth.saveAccessData(res)
      console.log(`sei dentro boyyy ${res.user.email}`);
      this.router.navigate(['/'])
    })
  }
}

