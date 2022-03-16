import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LanguageResolverService} from "../../../shared/services/language-resolver.service";
import { PostsListComponent } from './posts-list/posts-list.component';

const routes: Routes = [
  {
    path: 'edit',
    resolve: {langs: LanguageResolverService},
    loadChildren: './edit-post/edit-post.module#EditPostModule'
  },
  {
    path: 'all',
    resolve: {langs: LanguageResolverService},
    loadChildren: './posts-list/posts-list.module#PostsListModule'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BlogModule {
}
