import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormPostComponent } from './form-post/form-post.component';
import { FormsModule } from '@angular/forms';
import { NgZModule } from 'src/app/ng-zorro/ng-z/ng-z.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzCollapseModule } from 'ng-zorro-antd/collapse'

@NgModule({
  declarations: [
    HomeComponent,
    FormPostComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgZModule,
    NzDropDownModule,
    FontAwesomeModule,
    NzCollapseModule,
  ]
})
export class HomeModule { }
