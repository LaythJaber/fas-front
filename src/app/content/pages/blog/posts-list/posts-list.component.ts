import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BlogPostsService} from "../../../../shared/services/blog-posts.service";
import {BlogPost, BlogPostTrans} from "../../../../shared/models/blog/blog-post";
import {Language} from "../../../../shared/models/language";
import {Language as LanguageEnum} from "../../../../shared/enum/language.enum";
import {ActivatedRoute} from "@angular/router";
import {debounceTime, distinctUntilChanged, pluck, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {

  searchFormControl = new FormControl();
  page = 1;
  pageSize = 10;
  totalElements;
  blogPosts: BlogPost[];
  langs: Language[];
  langsFilter = new FormControl();
  unsub = new Subject();
  constructor(
    private blogPostsService: BlogPostsService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetAlertService,
    private translateService: TranslateService,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['BLOG', 'LIST_OF_POSTS']);
    this.activatedRoute.data
      .pipe(pluck('langs'))
      .subscribe((langs: Language[]) => {
        this.langs = langs;
        this.langsFilter.setValue(langs.find(u => u.code === LanguageEnum.it).id);
      });
    this.loadBlogPosts();
    this.search();
  }

  loadBlogPosts() {
    this.blogPostsService
      .getBlogPosts({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value})
      .subscribe(resp => {
        this.blogPosts = resp.data;
        this.totalElements = resp.totalRecords;
      })
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  deleteBlogPost(id) {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          this.blogPostsService.deleteBlogPost(id).subscribe(() => {
            this.loadBlogPosts();
          });
        }
      })
  }

  private search() {
    this.searchFormControl.valueChanges
      .pipe(takeUntil(this.unsub), debounceTime(250), distinctUntilChanged())
      .subscribe(v =>
        this.loadBlogPosts()
      );
  }
}
