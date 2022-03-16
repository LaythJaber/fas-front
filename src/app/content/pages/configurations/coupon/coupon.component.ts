import { Component, OnInit } from '@angular/core';
import {ImageFile, ImageType} from "../../multimedia/home-settings/home-settings.component";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpEventType} from "@angular/common/http";
import {MultimediaService} from "../../../../shared/services/multimedia.service";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder} from "@angular/forms";
import {UserService} from "../../../../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  readonly LOGO_MAX_SIZE = 512 * 1000; // = 500KB
  couponDefaultImage: ImageFile;

  saveCouponSpinnerValue = 0;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private sweetAlertService: SweetAlertService,
    private sanitize: DomSanitizer,
    private multimediaService: MultimediaService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'COUPON']);
    this.loadHomeMultimedia();
  }

  loadHomeMultimedia() {
    this.multimediaService.getCurrentGroupHomeMultimedia().subscribe(res => {
      console.log('multi res = ', res);
      if (res) {
        this.couponDefaultImage = {
          ...this.couponDefaultImage,
          url: res.couponDefaultImage
        };
      }
    })
  }


  async logoFileChange($event, type: ImageType = 'LOGO') {
    let imgFile = $event.target.files[0] || null;
    if (imgFile && imgFile.size > this.LOGO_MAX_SIZE) {
      await this.sweetAlertService.danger('Max logo size is 500KB! try again with another image');
      return;
    }
    let fileReader = new FileReader();
    fileReader.onload = (ev: any) => {
      let result;
      if (imgFile.type.includes('svg')) {
        result = this.sanitize.bypassSecurityTrustUrl(fileReader.result as string);
      } else {
        result = fileReader.result;
      }
      switch (type) {
        case 'COUPON': {
          this.couponDefaultImage = {
            imgFile,
            imgResult: result
          };
          break;
        }
      }
    };
    fileReader.readAsDataURL(imgFile);
  }

  saveDefaultImages() {
    const formData = new FormData();
    formData.append('couponDefaultImage', this.couponDefaultImage ? this.couponDefaultImage.imgFile : null);
    this.multimediaService.updateDefaultImages(formData).subscribe(ev => {
      if (ev.type === HttpEventType.UploadProgress) {
        this.saveCouponSpinnerValue = (ev.loaded / ev.total) * 100;
      }
      if (ev.type === HttpEventType.Response) {
        this.matSnackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.saveCouponSpinnerValue = 0;
        if (ev.body.couponDefaultImageUrl) {
          this.couponDefaultImage = {
            url: ev.body.couponDefaultImageUrl,
            imgFile: null,
            imgResult: null
          };
        }
      }
    });
  }

  deleteDefaultCouponImage() {
    this.sweetAlertService
      .warning(this.translateService.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          if (this.couponDefaultImage.imgResult) {
            this.couponDefaultImage.imgResult = null;
            this.couponDefaultImage.imgFile = null
          }
          else {
            this.multimediaService.deleteDefaultImage('COUPON').subscribe((r) => {
              this.couponDefaultImage.url = null;
            });
          }
        }
      });
  }


}
