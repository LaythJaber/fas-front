import {Component, OnInit} from '@angular/core';
import {Language} from "../../../../shared/models/language";
import {ActivatedRoute, Router} from "@angular/router";
import {map, take} from "rxjs/operators";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {BlogPostsService} from "../../../../shared/services/blog-posts.service";
import {BlogPost} from "../../../../shared/models/blog/blog-post";
import {HttpEventType} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {MatDialog} from "@angular/material/dialog";
import {CropImageComponent} from "../../../../shared/compoenent/crop-image/crop-image.component";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  langs: Language[];
  postFrom: FormGroup;
  coverImage: {
    result: any;
    file: File;
  };
  editorConfig: AngularEditorConfig;
  blogPost: BlogPost;
  saveSpinnerValue = 0;
  selectedTab: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private blogPostsService: BlogPostsService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['BLOG', 'CREATE_POST']);
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: '5rem',
    };
    this.activatedRoute.data
      .pipe(map(u => u ? (u.langs as Language[]) : null))
      .subscribe(langs => {
        this.langs = langs;
        if (langs) {
          this.buildForm(langs);
        }
      });
    const postId = this.activatedRoute.snapshot.paramMap.get('id');
    if (postId) {
      this.breadcrumbService.sendBreadcrumb(['BLOG', 'EDIT_POST']);
      this.blogPostsService.getBlogPostById(postId).subscribe(post => {
        this.blogPost = post;
        this.postFrom.patchValue(post);
        while (this.postTrans.length > 0) {
          this.postTrans.removeAt(0);
        }
        this.coverImage = {
          ...this.coverImage,
          result: post.coverImageUrl
        };
        this.langs.forEach(u => {
          const obj = post.blogPostTrans.find(v => v.langCodeId == u.id);
          const ctrl = this.formBuilder.group(obj);
          this.postTrans.push(ctrl);
        });
      });
    }
    this.selectedTab = this.langs.findIndex(u => u.code === this.translateService.currentLang);
  }

  private buildForm(langs: Language[]) {
    this.postFrom = this.formBuilder.group({
      id: null,
      blogPostTrans: this.formBuilder.array(
        langs.map(l => {
          return this.formBuilder.group({
            id: null,
            langCode: l.code,
            langCodeId: l.id,
            postTitle: null,
            post: null,
          });
        })
      )
    });
  }

  get postTrans() {
    return this.postFrom.get('blogPostTrans') as FormArray;
  }

  coverImageFileChange(ev: any) {
    const file = ev.target.files[0];
    /* const fileReader = new FileReader();
     fileReader.onload = (ev) => {
       this.coverImage = {
         file: file,
         result: fileReader.result
       };
     };
     fileReader.readAsDataURL(file);*/
  }

  openImageInput() {
    this.matDialog.open(CropImageComponent, {
      width: '800px',
      data: {aspectRatio: 3.56}
    }).afterClosed().pipe(take(1))
      .subscribe(res => {
        if (res) {
          const fileReader = new FileReader();
          fileReader.onload = (ev) => {
            this.coverImage = {
              file: res,
              result: fileReader.result
            };
          };
          fileReader.readAsDataURL(res);
        }
      });
  }

  save() {
    if (this.postFrom.invalid) {
      return;
    }
    console.log(this.postFrom.value);
    const formData = new FormData();
    if (this.coverImage && this.coverImage.file) {
      formData.append('coverImage', this.coverImage.file);
    }
    formData.append('blogPost', new Blob([JSON.stringify(this.postFrom.value)], {type: 'application/json'}));
    this.blogPostsService.updateBlogPost(formData).subscribe(res => {
      if (res.type === HttpEventType.UploadProgress) {
        this.saveSpinnerValue = (res.loaded / res.total) * 100
      }
      if (res.type === HttpEventType.Response) {
        this.saveSpinnerValue = 0;
        if (res.status === 200) {
          this.matSnackBar.open(this.translateService.instant('BLOG.UPDATED_SUCCESS'), 'Ok', {duration: 1500});
          this.router.navigate(['/posts/all']);
        } else {
          this.matSnackBar.open(this.translateService.instant('BLOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 1500});
        }
      }
    });
  }
}
