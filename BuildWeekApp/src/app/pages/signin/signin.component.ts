import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Iregister } from 'src/app/models/iregister';
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
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      btd: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      password: new FormControl(null, Validators.required)
    })
  }

  submit():void{
    console.log(this.form.value);
let newUser = this.form.value
newUser.friends = []
newUser.notifications = []
    this.auth.register(newUser)
    .subscribe(res => {
      console.log(res);
      this.router.navigate(['/']);
      this.auth.saveAccessData(res)
      console.log(this.form.value);

      alert(`User ${res.user.name} registered successfully`)
      this.form.reset();
    })
  }
}
