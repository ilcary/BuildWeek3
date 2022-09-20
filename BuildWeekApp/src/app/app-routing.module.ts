import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoLoggedNavGuard } from './services/no-logged-nav.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule), canActivate:[NoLoggedNavGuard] },
  { path: 'editUsers', loadChildren: () => import('./pages/users/edit-user/edit-user.module').then(m => m.EditUserModule), canActivate:[NoLoggedNavGuard] },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'signin', loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninModule) },
  { path: 'post', loadChildren: () => import('./pages/post/post.module').then(m => m.PostModule) },
  { path: 'profile/:id', loadChildren: () => import('./client-profile/client-profile.module').then(m => m.ClientProfileModule), canActivate:[NoLoggedNavGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
