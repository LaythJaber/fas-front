import { Pipe, PipeTransform } from '@angular/core';
import {BlogPost, BlogPostTrans} from "../../../../shared/models/blog/blog-post";

@Pipe({
  name: 'filterPostsByLang'
})
export class FilterPostsByLangPipe implements PipeTransform {

  transform(posts: BlogPost[], langId: number): { updatedAt: any; postId, info: BlogPostTrans, coverImageUrl}[] {
    return !posts ? [] : posts.map(u => {
      return {
        postId: u.id,
        coverImageUrl: u.coverImageUrl,
        info: u.blogPostTrans.find(value => value.langCodeId === langId),
        updatedAt: u.updatedAt,
      }
    })
  }

}
