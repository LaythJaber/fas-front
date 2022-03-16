import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Sortable} from '@shopify/draggable';
import {MatDialog} from "@angular/material/dialog";
import {take} from "rxjs/operators";
import {CarouselFormComponent} from "./components/carousel-form/carousel-form.component";
import {LanguageService} from "../../../../shared/services/language.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MultimediaService} from "../../../../shared/services/multimedia.service";
import {HttpEventType} from "@angular/common/http";
import {UserService} from "../../../../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BrandLogo, CarouselImage, SecondarySlide} from "../../../../shared/models/multimedia/home-multimedia";
import {TranslateService} from "@ngx-translate/core";
import {CropImageComponent} from "../../../../shared/compoenent/crop-image/crop-image.component";
import {Language} from "../../../../shared/models/language";
import {SecondarySlideFormComponent} from "./components/secondary-slide-form/secondary-slide-form.component";
import {BrandLogoFormComponent} from "./components/brand-logo-form/brand-logo-form.component";

@Component({
  selector: 'app-home-settings',
  templateUrl: './home-settings.component.html',
  styleUrls: ['./home-settings.component.scss']
})
export class HomeSettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('imageGridCarousel') imageGridCarousel: ElementRef;
  @ViewChild('slidesGrid') secondarySlidesGrid: ElementRef;
  readonly LOGO_MAX_SIZE = 512 * 1000; // = 500KB
  readonly SLIDE_IMG_MAX_SIZE = 2097152; // = 2MB*
  logo: ImageFile;
  faviconLogo: ImageFile;
  cartIcon: ImageFile;
  productDefaultImage: ImageFile;
  categoryDefaultImage: ImageFile;
  otherOptionsForm: FormGroup;
  firstStepIcon: ImageFile;
  secondStepIcon: ImageFile;
  thirdStepIcon: ImageFile;
  saveSpinnerValue = 0;
  loadingOtherOptions = false;
  groupId;
  parallax: ImageFile;
  carouselImages: CarouselImage[] = [];
  secondarySlides: SecondarySlide[] = [];
  saveLogosSpinnerValue = 0;
  saveIconsSpinnerValue = 0;
  langs: Language[];
  brandsLogos: BrandLogo[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private sweetAlertService: SweetAlertService,
    private sanitize: DomSanitizer,
    private matDialog: MatDialog,
    private languageService: LanguageService,
    private fb: FormBuilder,
    private multimediaService: MultimediaService,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) {
  }


  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['MULTIMEDIA', 'HOME']);
    this.groupId = this.userService.getUser().groupId;
    this.loadHomeMultimedia();
  }

  ngAfterViewInit(): void {
    const sortableCarousel = new Sortable(this.imageGridCarousel.nativeElement, {
      draggable: '.sortable-item',
      delay: 100,
      mirror: {
        constrainDimensions: true,
      }
    });
    const sortableSlides = new Sortable(this.secondarySlidesGrid.nativeElement, {
      draggable: '.sortable-item',
      delay: 100,
      mirror: {
        constrainDimensions: true,
      }
    });
    sortableCarousel.on('sortable:stop', this.moveCarousel.bind(this));
    sortableSlides.on('sortable:stop', this.moveSecondarySlide.bind(this));
  }

  private moveCarousel(ev) {
    const oldIndex = ev.oldIndex;
    const newIndex = ev.newIndex;
    if (oldIndex === newIndex) {
      return;
    }
    const source = ev.dragEvent.source;
    const carouselId = source.dataset.carouselId;
    const request = {oldIndex, newIndex, carouselId};
    this.multimediaService.moveCarouselImage(request).subscribe(() => {
      this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS'), null, {duration: 1500});
    }, error => {
      this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.INTERNAL_SERVER_ERROR'), 'OK');
    });
  }

  private moveSecondarySlide(ev) {
    const oldIndex = ev.oldIndex;
    const newIndex = ev.newIndex;
    if (oldIndex === newIndex) {
      return;
    }
    const source = ev.dragEvent.source;
    const slideId = source.dataset.carouselId;
    const request = {oldIndex, newIndex, slideId};
    this.multimediaService.moveSecondarySlide(request).subscribe(() => {
      this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS'), null, {duration: 1500});
    }, error => {
      this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.INTERNAL_SERVER_ERROR'), 'OK');
    });
  }

  deleteSecondarySlide(id, index) {
    this.sweetAlertService
      .warning(this.translateService.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          this.multimediaService.deleteSecondarySlide(id).subscribe(() => {
            this.secondarySlides.splice(index, 1)
          });
        }
      });
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
        case 'LOGO': {
          this.logo = {
            imgFile,
            imgResult: result
          };
          break;
        }
        case 'FAVICON': {
          this.faviconLogo = {
            imgFile,
            imgResult: result
          };
          break;
        }
        case 'CART': {
          this.cartIcon = {
            imgFile,
            imgResult: result
          };
          break;
        }
        case 'PRODUCT': {
          this.productDefaultImage = {
            imgFile,
            imgResult: result
          };
          break;
        }
        case 'CATEGORY': {
          this.categoryDefaultImage = {
            imgFile,
            imgResult: result
          };
          break;
        }
      }
    };
    fileReader.readAsDataURL(imgFile);
  }

  openCarouselCropper() {
    this.matDialog.open(CropImageComponent, {
      width: '1200px',
      disableClose: true
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.matDialog.open(CarouselFormComponent, {
            width: '1000px',
            disableClose: true,
            data: {
              file: res,
              index: this.carouselImages ? this.carouselImages.length : 0,
            }
          }).afterClosed()
            .pipe(take(1))
            .subscribe(res => {
                if (res) {
                  this.carouselImages = [...this.carouselImages, res]
                }
              }
            );
        }
      });
  }

  openEditCarouselDialog(carousel) {
    this.matDialog.open(CarouselFormComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        carousel
      }
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        console.log({res});
        if (res) {
          this.loadHomeMultimedia();
          this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS') + '⚡', 'Ok', {duration: 1500});
        }
      });
  }

  deleteCarouselImage(id, index) {
    this.sweetAlertService
      .warning(this.translateService.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          this.multimediaService.deleteCarouselImage(id).subscribe(() => {
            this.carouselImages.splice(index, 1)
          });
        }
      });
  }

  deleteDefaultCategoryImage() {
    this.sweetAlertService
      .warning(this.translateService.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          if (this.categoryDefaultImage.imgResult) {
            this.categoryDefaultImage.imgResult = null;
            this.categoryDefaultImage.imgFile = null
          } else {
            this.multimediaService.deleteDefaultImage('CATEGORY').subscribe((r) => {
              this.categoryDefaultImage.url = null;
            });
          }
        }
      });
  }

  deleteDefaultProductImage() {
    this.sweetAlertService
      .warning(this.translateService.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          if (this.productDefaultImage.imgResult) {
            this.productDefaultImage.imgResult = null;
            this.productDefaultImage.imgFile = null
          } else {
            this.multimediaService.deleteDefaultImage('PRODUCT').subscribe((r) => {
              this.productDefaultImage.url = null;
            });
          }
        }
      });
  }

  private buildOtherOptionsForm() {
    this.otherOptionsForm = this.fb.group({
      serviceSectionDisplay: false,
      blogDisplay: false,
      parallaxDisplay: false,
      newsletterDisplay: false,
      socialIconsDisplay: false,
      facebookLink: null,
      instagramLink: null,
      twitterLink: null,
      copyRight: null,
      storeInfo: this.fb.group({
        address: null,
        googleMapsUrl: null,
        email: [null, Validators.email],
        phone: [null, Validators.compose([Validators.minLength(8)])],
        fax: [null, Validators.compose([Validators.minLength(8)])],
      }),
      paymentCardsDisplay: false,
      transInfo: this.fb.array([])
    });
  }

  get otherOptionsTransInfo() {
    return this.otherOptionsForm.get('transInfo') as FormArray;
  }

  async stepsIconFileChange($event, step: number) {
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
      switch (step) {
        case 0: {
          this.firstStepIcon = {
            imgFile,
            imgResult: result
          };
          break;
        }
        case 1: {
          this.secondStepIcon = {
            imgFile,
            imgResult: result
          };
          break;
        }
        case 2: {
          this.thirdStepIcon = {
            imgFile,
            imgResult: result
          };
          break;
        }
      }
    };
    fileReader.readAsDataURL(imgFile);
  }

  async parallaxFileChange($event) {
    let imgFile = $event.target.files[0] || null;
    if (imgFile && imgFile.size > this.SLIDE_IMG_MAX_SIZE) {
      await this.sweetAlertService.danger('Max parallax image size is 2MB! try again with another image');
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
      this.parallax = {
        imgResult: result,
        imgFile: imgFile
      };
    };
    fileReader.readAsDataURL(imgFile);
  }

  saveOtherOptions() {
    if (this.otherOptionsForm.invalid) {
      return;
    }
    const formData = new FormData();
    let otherOptions = this.otherOptionsForm.value;
    formData.append("otherOptions", new Blob([JSON.stringify(otherOptions)], {type: 'application/json'}));
    formData.append("firstStepIcon", this.firstStepIcon ? this.firstStepIcon.imgFile : null);
    formData.append("secondStepIcon", this.secondStepIcon ? this.secondStepIcon.imgFile : null);
    formData.append("thirdStepIcon", this.thirdStepIcon ? this.thirdStepIcon.imgFile : null);
    formData.append("parallax", this.parallax ? this.parallax.imgFile : null);
    this.multimediaService.updateOtherOptionsHomeMultimedia(formData).subscribe(res => {
      if (res.type === HttpEventType.UploadProgress) {
        this.loadingOtherOptions = true;
        this.saveSpinnerValue = (res.loaded / res.total) * 100;
      }
      if (res.type === HttpEventType.Response) {
        this.saveSpinnerValue = 0;
        this.loadingOtherOptions = false;
        this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS') + '⚡', 'Ok', {duration: 1500});
      }
    });
  }

  loadHomeMultimedia() {
    this.buildOtherOptionsForm();
    this.multimediaService.getCurrentGroupHomeMultimedia().subscribe(res => {
      if (!res) {
        this.languageService.getLanguages().subscribe(langs => {
          this.langs = langs;
          langs.forEach(u => {
            const formGroup = this.fb.group({
              id: null,
              langCodeId: u.id,
              langCode: u.code,
              firstStepTitle: null,
              firstStepSubtitle: null,
              secondStepTitle: null,
              secondStepSubtitle: null,
              thirdStepTitle: null,
              thirdStepSubtitle: null,
              slideLabel: null,
              newsletterTitle: null,
              newsletterSubtitle: null,
              blogTitle1: null,
              blogTitle2: null,
            });
            this.otherOptionsTransInfo.push(formGroup);
          });
        });
      } else {
        this.otherOptionsForm.patchValue(res);
        this.carouselImages = res.carouselImages;
        this.secondarySlides = res.secondarySlides;
        this.brandsLogos = res.brandsLogos;
        this.logo = {
          ...this.logo,
          url: res.logo
        };
        this.faviconLogo = {
          ...this.faviconLogo,
          url: res.favicon
        };
        this.cartIcon = {
          ...this.cartIcon,
          url: res.cartIcon
        };
        this.productDefaultImage = {
          ...this.productDefaultImage,
          url: res.productDefaultImage
        };
        this.categoryDefaultImage = {
          ...this.categoryDefaultImage,
          url: res.categoryDefaultImage
        };
        while (this.otherOptionsTransInfo.length > 0) {
          this.otherOptionsTransInfo.removeAt(0);
        }
        this.languageService.getLanguages().subscribe(langs => {
          this.langs = langs;
          langs.forEach(u => {
            const obj = res.transInfo.find(v => v.langCodeId === u.id);
            const formGroup = this.fb.group({
              id: obj ? obj.id : null,
              langCodeId: u.id,
              langCode: u.code,
              firstStepTitle: obj ? obj.firstStepTitle : null,
              firstStepSubtitle: obj ? obj.firstStepSubtitle : null,
              secondStepTitle: obj ? obj.secondStepTitle : null,
              secondStepSubtitle: obj ? obj.secondStepSubtitle : null,
              thirdStepTitle: obj ? obj.thirdStepTitle : null,
              thirdStepSubtitle: obj ? obj.thirdStepSubtitle : null,
              slideLabel: obj ? obj.slideLabel : null,
              newsletterTitle: obj ? obj.newsletterTitle : null,
              newsletterSubtitle: obj ? obj.newsletterSubtitle : null,
              blogTitle1: obj ? obj.blogTitle1 : null,
              blogTitle2: obj ? obj.blogTitle2 : null,
            });
            this.otherOptionsTransInfo.push(formGroup);
          });
        });
        this.firstStepIcon = {
          url: res.firstStepIcon,
          imgFile: null,
          imgResult: null,
        };
        this.secondStepIcon = {
          url: res.secondStepIcon,
          imgFile: null,
          imgResult: null,
        };
        this.thirdStepIcon = {
          url: res.thirdStepIcon,
          imgFile: null,
          imgResult: null,
        };
        this.parallax = {
          url: res.parallaxUrl,
          imgFile: null,
          imgResult: null,
        };
      }
    })
  }

  saveLogoAndFavicon() {
    const formData = new FormData();
    formData.append('logo', this.logo ? this.logo.imgFile : null);
    formData.append('favicon', this.faviconLogo ? this.faviconLogo.imgFile : null);
    this.multimediaService.updateLogos(formData).subscribe(ev => {
      if (ev.type === HttpEventType.UploadProgress) {
        this.saveLogosSpinnerValue = (ev.loaded / ev.total) * 100;
      }
      if (ev.type === HttpEventType.Response) {
        this.saveLogosSpinnerValue = 0;
        if (ev.body.logoUrl) {
          this.logo = {
            url: ev.body.logoUrl,
            imgFile: null,
            imgResult: null
          };
        }
        if (ev.body.faviconUrl) {
          this.faviconLogo = {
            imgFile: null,
            imgResult: null,
            url: ev.body.faviconUrl
          };
        }
      }
    });
  }

  saveIcon() {
    const formData = new FormData();
    formData.append('cartIcon', this.cartIcon ? this.cartIcon.imgFile : null);
    this.multimediaService.updateIcon(formData).subscribe(ev => {
      if (ev.type === HttpEventType.UploadProgress) {
        this.saveIconsSpinnerValue = (ev.loaded / ev.total) * 100;
      }
      if (ev.type === HttpEventType.Response) {
        this.saveIconsSpinnerValue = 0;
        this.cartIcon = {
          url: ev.body.cartIconUrl,
          imgFile: null,
          imgResult: null
        };
      }
    })
  }

  saveDefaultImages() {
    const formData = new FormData();
    formData.append('productDefaultImage', this.productDefaultImage ? this.productDefaultImage.imgFile : null);
    formData.append('categoryDefaultImage', this.categoryDefaultImage ? this.categoryDefaultImage.imgFile : null);
    this.multimediaService.updateDefaultImages(formData).subscribe(ev => {
      if (ev.type === HttpEventType.UploadProgress) {
        this.saveLogosSpinnerValue = (ev.loaded / ev.total) * 100;
      }
      if (ev.type === HttpEventType.Response) {
        this.saveLogosSpinnerValue = 0;
        if (ev.body.productDefaultImageUrl) {
          this.productDefaultImage = {
            url: ev.body.productDefaultImageUrl,
            imgFile: null,
            imgResult: null
          };
        }
        if (ev.body.categoryDefaultImageUrl) {
          this.categoryDefaultImage = {
            imgFile: null,
            imgResult: null,
            url: ev.body.categoryDefaultImageUrl
          };
        }
      }
    });
  }

  openSecondarySlideCropper() {
    this.matDialog.open(CropImageComponent, {
      width: '1200px',
      disableClose: true
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.matDialog.open(SecondarySlideFormComponent, {
            width: '1000px',
            disableClose: true,
            data: {
              file: res,
              index: this.secondarySlides ? this.secondarySlides.length : 0,
            }
          }).afterClosed()
            .pipe(take(1))
            .subscribe(res => {
                if (res) {
                  this.secondarySlides = [...this.secondarySlides, res]
                }
              }
            );
        }
      });
  }

  openEditSecondarySlideDialog(slide: SecondarySlide) {
    this.matDialog.open(SecondarySlideFormComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        slide
      }
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.loadHomeMultimedia();
          this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS') + '⚡', 'Ok', {duration: 1500});
        }
      });
  }

  toggleActiveSlide(slide: SecondarySlide) {
    this.multimediaService.toggleSecondarySlide(slide.id).subscribe(v => {
      slide.active = !slide.active;
      this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS'), null, {duration: 1500});
    });
  }

  selectBrandLogo($event: any) {
    const file = $event.target.files[0];
    this.matDialog.open(BrandLogoFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        editMode: false,
        imageFile: file,
      }
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
      if (res) {
        this.brandsLogos = [...this.brandsLogos, res];
      }
    });
  }

  openEditBrandLogo(logo: BrandLogo) {
    this.matDialog.open(BrandLogoFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        editMode: true,
        logo: logo,
      }
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.loadHomeMultimedia();
          this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS') + '⚡', 'Ok', {duration: 1500});
        }
      });
  }

  deleteBrandLogo(id: number, index: number) {
    this.sweetAlertService
      .warning(this.translateService.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          this.multimediaService.deleteBrandLogo(id).subscribe(() => {
            this.brandsLogos.splice(index, 1)
          });
        }
      });
  }
}


export type ImageType = 'LOGO' | 'FAVICON' | 'CART' | 'PRODUCT' | 'CATEGORY' | 'COUPON';

export interface ImageFile {
  imgResult;
  imgFile;
  url?;
}
