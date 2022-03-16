import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PromoModel} from '../../../shared/models/promo-model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {ImageService} from '../../../shared/services/image.service';
import {ActivatedRoute} from '@angular/router';
import {PromoService} from '../../../shared/services/promo.service';
import * as Swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {BLANK_MAIL} from './blank-mail';
import {CropImageComponent} from '../../../shared/compoenent/crop-image/crop-image.component';
import {take} from 'rxjs/operators';
import {PromotionDetailsFormComponent} from './promotion-details-form.component';
import * as uuid from 'uuid';

declare var unlayer;

@Component({
  selector: 'app-promo-template-editor',
  templateUrl: './promo-template-editor.component.html',
  styleUrls: ['./promo-template-editor.component.scss']
})
export class PromoTemplateEditorComponent implements OnInit, AfterViewInit {
  promoModels: PromoModel[] = [];
  modelsFormControl = new FormControl();
  loadedModel: PromoModel;
  private editor: any;
  cropperOpen = false;

  constructor(
    private matDialog: MatDialog,
    private promoModelService: PromoService,
    private breadcrumbService: BreadcrumbService,
    private snackbar: MatSnackBar,
    private translateService: TranslateService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['TEMPLATE_PROMO']);
    this.modelsFormControl.valueChanges.subscribe(v => {
      if (v) {
        this.promoModelService.getPromoModelById(v).subscribe(data => {
          this.loadedModel = data;
          if (data.design) {
            this.editor.loadDesign(JSON.parse(data.design));
          } else {
            this.editor.loadDesign(BLANK_MAIL);
          }
        });
      } else {
        this.editor.loadDesign(BLANK_MAIL);
      }
    });
    this.loadPromoTemplates();
  }


  ngAfterViewInit(): void {
    this.editor = unlayer.createEditor({
      id: 'email-editor',
      displayMode: 'email',
      locale: 'it-IT',
      translations: {
        'it-IT': {
          'editor.image.upload_error': `C'è stato un errore nel caricamento dell'immagine. Verifica che l'immagine sia valida e che pesi meno di 2MB.`
        }
      },
      // editor: {
      //   minRows: 5,
      //   maxRows: 5,
      // },
      tools: {
        button: {
          draggable: false
        }
      }
    });

    this.editor.loadDesign(BLANK_MAIL);
    this.editor.addEventListener('design:updated', (data) => {
      // Design is updated by the user
      this.editor.exportHtml(async (d: any) => {
        if (data.type === 'content:modified' && data.item.type === 'image') {
          const imgCheckRslt = await this.check2ndRowImg(d.design);
          console.log({imgCheckRslt});
          if (imgCheckRslt && !imgCheckRslt.result && !this.cropperOpen) {
            this.cropperOpen = true;
            this.matDialog.open(CropImageComponent, {
              width: '650px',
              // data: {
              //   image: imgCheckRslt.file,
              //   aspectRatio: imgCheckRslt.aspectRatio < 4 / 5 ? 4 / 5 : 1.91
              // },
              disableClose: true,
            }).afterClosed().pipe(take(1))
              .subscribe(img => {
                this.cropperOpen = false;
                const imgFile = this.dataURLtoFile(img, 'image.jpeg');
                const formData = new FormData();
                formData.append('image', imgFile, imgCheckRslt.filename);
                this.imageService.uploadUnlayerImage(formData).subscribe(ev => {
                  if (ev.type === HttpEventType.Response) {
                    /*let body = d.design.body;
                    let secondRow = body.rows[1].columns[0].contents;
                    secondRow[0].values.src.url = ev.body.url;*/
                    imgCheckRslt.secondRow[0].values.src.url = ev.body.url;
                    this.editor.loadDesign(BLANK_MAIL);
                    this.editor.loadDesign(d.design);
                  }
                });
              });
          }
        }
        // if (this.check2ndAnd3rdRow(d.design)) {
        this.editor.loadDesign(d.design);
        // }
      });
    });
    this.editor.registerCallback('image', async (file, done) => {
      const image = file.attachments[0] as File;
      const formData = new FormData();
      if (image.type !== 'image/jpeg' && image.type !== 'image/jpg') {
        Swal.default.fire({
          icon: 'error',
          text: 'Image must be JPEG or JPG.'
        });
        return;
      }
      // const {r} = await this.getImageAspectRatio(image);
      formData.append('image', image, uuid() + '.jpg');
      this.imageService.uploadUnlayerImage(formData).subscribe(ev => {
        if (ev.type === HttpEventType.Response) {
          done({progress: 100, url: ev.body.url});
        }
      });
    });
  }


  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }

  check2ndAnd3rdRow(design): boolean { // if true design is updated otherwise not update
    let updated = false;
    const body = design.body;
    const secondRow = body.rows[1].columns[0].contents;
    const thirdRow = body.rows[2].columns[0].contents;
    if (secondRow.length > 1) {
      let index = secondRow.findIndex(u => u.type !== 'image');
      if (index < 0) {
        index = secondRow.findIndex(u => u.type === 'image' && u.values.src.url.startsWith('https://via.placeholder.com'));
      }

      if (index >= 0) {
        secondRow.splice(index, 1);
        secondRow[0].values = {
          ...secondRow[0].values,
          selectable: true,
          draggable: false,
          duplicatable: false,
          deletable: false,
        };
        updated = true;
      }
    }
    if (thirdRow.length > 1) {
      const defaultText = `<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.</p>`;
      let index = thirdRow.findIndex(u => u.type !== 'text');

      if (index < 0) {
        index = thirdRow.findIndex(u => u.type === 'text' && u.values.text === defaultText);
      }

      if (index >= 0) {
        thirdRow.splice(index, 1);
        thirdRow[0].values = {
          ...thirdRow[0].values,
          selectable: true,
          draggable: false,
          duplicatable: false,
          deletable: false,
        };
        updated = true;
      }
    }
    return updated;
  }

  check2ndRowImg(design): Promise<{ result: boolean, secondRow: any, file: File, aspectRatio: number, filename: string }> {
    return new Promise(resolve => {
      const body = design.body;
      const secondRow = body.rows[1].columns[0].contents;
      const secondRowImg = secondRow[0].values.src.url;
      if (!secondRowImg.startsWith('https://via.placeholder.com')) {
        fetch(secondRowImg)
          .then(u => u.blob())
          .then(async u => {
            const {h, w, r} = await this.getImageAspectRatio(u as File);
            const filename: string = this.getFilenameFromHost(secondRowImg.substring(7));
            resolve({
              result: r >= 4 / 5 && r <= 1.91,
              secondRow,
              file: u as File,
              aspectRatio: r,
              filename
            });
          })
          .catch(error => {
            console.error(error);
          });
        return;
      }
      resolve(null);
    });
  }

  private getFilenameFromHost(s: string) {
    return s.split('/')[s.split('/').length - 1];
  }

  getImageAspectRatio(image: File): Promise<{ h, w, r }> {
    return new Promise(resolve => {
      let h, w, r;
      const fileReader = new FileReader();
      fileReader.onload = (ev1: any) => {
        const img = new Image();

        img.onload = () => {
          h = img.height;
          w = img.width;
          r = Number.parseFloat(
            Number.parseFloat(w / h + '').toFixed(2)
          );
          resolve({h, w, r});
        };

        img.src = ev1.target.result;
      };
      fileReader.readAsDataURL(image);
    });
  }

  save($event) {
    this.editor.exportHtml((data: any) => {
      const postImageUrl = this.getPostImageSection(data.design)[0].values.src.url;
      const htmlPost = this.getPostTextSection(data.design)[0].values.text;
      const orginialText = new DOMParser().parseFromString(htmlPost, 'text/html').documentElement.textContent;
      const postText = orginialText.replace(/(<([^>]+)>)/gi, '');
      this.promoModelService.updateModel({
        ...this.loadedModel,
        template: data.html,
        design: JSON.stringify(data.design),
        postText,
        postImageUrl
      }).subscribe(id => {
        Swal.default.fire({
          icon: 'success',
          text: this.translateService.instant('PROMO_EDITOR.TEMPLATE_SAVED'),
          showConfirmButton: false,
          timer: 2500
        });
        this.loadPromoTemplates();
        this.modelsFormControl.setValue(id);
      }, error => {
        this.snackbar.open('Server Error', 'Ok');
      });
    });
  }

  getPostImageSection(design) {
    console.log(design);
    let body = design.body;
    return body.rows[1].columns[0].contents;
  }

  getPostTextSection(design) {
    let body = design.body;
    return body.rows[2].columns[0].contents;
  }

  openForm(edit) {
    this.matDialog.open(PromotionDetailsFormComponent, {
      width: '500px',
      disableClose: true,
      data: edit ? this.promoModels.find(u => u.id === this.modelsFormControl.value) : null
    }).afterClosed().subscribe(d => {
      if (d) {
        this.loadPromoTemplates();
        this.modelsFormControl.setValue(d === 'DELETE' ? null : d);
      }
    });
  }

  loadPromoTemplates() {
    this.promoModelService.getPromoModelsLight().subscribe(d => {
      this.promoModels = d.data;
      const templateId = this.activatedRoute.snapshot.queryParamMap.get('templateId');
      if (templateId) {
        this.modelsFormControl.patchValue(Number.parseInt(templateId));
      }
    });
  }


}
