import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {HttpEventType} from '@angular/common/http';
import * as Swal from 'sweetalert2';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageService} from '../../../../shared/services/image.service';
import * as uuid from 'uuid';
import {BLANK_MAIL} from '../../promo-template-editor/blank-mail';
import {CropImageComponent} from '../../../../shared/compoenent/crop-image/crop-image.component';

declare var unlayer;

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit, AfterViewInit {
  private editor: any;
  cropperOpen = false;

  constructor(
    private matDialog: MatDialog,
    private imageService: ImageService,
    private matDialogRef: MatDialogRef<TemplateEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) {
  }

  ngOnInit() {
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
    if (this.data && this.data.design) {
      this.editor.loadDesign(JSON.parse(this.data.design));
    } else {
      this.editor.loadDesign(BLANK_MAIL);
    }
    this.editor.addEventListener('design:updated', (data) => {
      this.editor.exportHtml(async (d: any) => {
        if (data.type === 'content:modified' && data.item.type === 'image') {
          const imgCheckRslt = await this.check2ndRowImg(d.design);
          console.log({imgCheckRslt});
          if (imgCheckRslt && !imgCheckRslt.result && !this.cropperOpen) {
            this.cropperOpen = true;
            this.matDialog.open(CropImageComponent, {
              width: '650px',
              data: {
                image: imgCheckRslt.file,
                // aspectRatio: imgCheckRslt.aspectRatio < 4 / 5 ? 4 / 5 : 1.91
              },
              disableClose: true,
            }).afterClosed().pipe(take(1))
              .subscribe(img => {
                this.cropperOpen = false;
                const imgFile = this.dataURLtoFile(img, 'image.jpeg');
                const formData = new FormData();
                formData.append('image', imgFile, imgCheckRslt.filename);
                this.imageService.uploadUnlayerImage(formData).subscribe(ev => {
                  if (ev.type === HttpEventType.Response) {
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
      formData.append('image', image, uuid() + '.jpg');
      this.imageService.uploadUnlayerImage(formData).subscribe(ev => {
        if (ev.type === HttpEventType.Response) {
          done({progress: 100, url: ev.body.url});
        }
      });
    });
  }

  getImageAspectRatio(image: File): Promise<{ h, w, r }> {
    return new Promise(resolve => {
      let h, w, r;
      const fileReader = new FileReader();
      fileReader.onload = (ev1: any) => {
        const img = new Image();

        img.onload = () => {
          w = img.width;
          h = img.height;
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
    const body = design.body;
    let updated = false;
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
            let filename: string = this.getFilenameFromHost(secondRowImg.substring(7));
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

  save() {
    this.editor.exportHtml((data: any) => {
      const postImageUrl = this.getPostImageSection(data.design)[0].values.src.url;
      const htmlPost = this.getPostTextSection(data.design)[0].values.text;
      const orginialText = new DOMParser().parseFromString(htmlPost, 'text/html').documentElement.textContent;
      const postText = orginialText.replace(/(<([^>]+)>)/gi, '');
      this.matDialogRef.close({
        postImageUrl,
        postText,
        template: data.html,
        design: JSON.stringify(data.design),
      });
    });
  }

  getPostImageSection(design) {
    const body = design.body;
    return body.rows[1].columns[0].contents;
  }

  getPostTextSection(design) {
    const body = design.body;
    return body.rows[2].columns[0].contents;
  }

  private getFilenameFromHost(s: string) {
    return s.split('/')[s.split('/').length - 1];
  }
}
