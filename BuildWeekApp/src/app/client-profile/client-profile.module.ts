import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ClientProfileRoutingModule } from './client-profile-routing.module';
import { ClientProfileComponent } from './client-profile.component';
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';


@NgModule({
  declarations: [
    ClientProfileComponent
  ],
  imports: [
    CommonModule,
    ClientProfileRoutingModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzCardModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzDropDownModule,
    FontAwesomeModule,
    NzCollapseModule
  ]
})
export class ClientProfileModule { }
