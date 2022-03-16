import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LazyRequest} from "../dto/lazy-request";
import {SearchResponse} from "../dto/search-response";
import {BlogPost} from "../models/blog/blog-post";

@Injectable({
  providedIn: 'root'
})
export class BlogPostsService {
  private readonly API = environment.api + '/blog-posts';

  constructor(private http: HttpClient) { }

  updateBlogPost(request) {
    return this.http.post<void>(this.API, request, {observe: 'events', reportProgress: true});
  }

  getBlogPosts(request: LazyRequest) {
    return this.http.post<SearchResponse<BlogPost>>(this.API + '/filter', request);
  }

  getBlogPostById(postId) {
    return this.http.get<BlogPost>(this.API + '/' + postId);
  }

  deleteBlogPost(postId) {
    return this.http.delete(this.API + '/' + postId);
  }
}
