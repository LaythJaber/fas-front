import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostsListComponent} from "./posts-list.component";
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import { FilterPostsByLangPipe } from './filter-posts-by-lang.pipe';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

const routes: Routes = [
  {path: '', component: PostsListComponent},
];

@NgModule({
  declarations: [
    PostsListComponent,
    FilterPostsByLangPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PostsListModule {
}
