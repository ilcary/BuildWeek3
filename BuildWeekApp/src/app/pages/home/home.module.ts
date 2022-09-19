import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormPostComponent } from './form-post/form-post.component';
import { FormsModule } from '@angular/forms';
import { NgZModule } from 'src/app/ng-zorro/ng-z/ng-z.module';


@NgModule({
  declarations: [
    HomeComponent,
    FormPostComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgZModule
  ]
})
export class HomeModule { }