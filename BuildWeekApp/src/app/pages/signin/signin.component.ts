import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {


  form!: FormGroup

  constructor(
    private auth: UserAuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      dtb: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    })
  }

  submit():void{
    this.auth.register(this.form.value)
    .subscribe(res => {
      console.log(res);

      alert(`User ${res.user.name} registered successfully`)
      this.form.reset();
    })
  }
}
