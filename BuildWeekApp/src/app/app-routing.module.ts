import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) }, { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule) }, { path: 'editUsers', loadChildren: () => import('./pages/users/edit-user/edit-user.module').then(m => m.EditUserModule) }, { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) }, { path: 'signin', loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninModule) }, { path: 'post', loadChildren: () => import('./pages/post/post.module').then(m => m.PostModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
