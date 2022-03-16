import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {TranslateService} from '@ngx-translate/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss']
})
export class CropImageComponent implements OnInit {
  imageChangeEvent: any;
  unsubscribe$ = new Subject();
  imageLoad = false;
  imageFile: any = null;
  selectedImage = false;
  croppedImage: any;
  constructor(
    public dialogRef: MatDialogRef<CropImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matSnackbar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  fileChange($event: Event) {
    this.imageLoad = true;
    this.selectedImage = true;
    if (($event.target as HTMLInputElement).files[0].type !== 'image/jpeg'
      && ($event.target as HTMLInputElement).files[0].type !== 'image/png') {
      this.matSnackbar.open(this.translateService.instant('IMAGE.NOT_IMAGE'), 'Ok', { duration: 5000 });
      this.imageLoad = false;
      return;
    }
    if (($event.target as HTMLInputElement).files[0].size > 2000000) {
      this.matSnackbar.open(this.translateService.instant('IMAGE.OVERSIZE'), 'Ok', { duration: 5000 });
      this.imageLoad = false;
      return;
    }
    this.imageFile = ($event.target as HTMLInputElement).files[0];
    this.imageChangeEvent = $event;


  }

  onDrop($event: DragEvent) {
    this.imageLoad = true;
    this.selectedImage = true;
    $event.preventDefault();
    if ($event.dataTransfer.files[0].type !== 'image/jpeg' && $event.dataTransfer.files[0].type !== 'image/png') {
      this.matSnackbar.open(this.translateService.instant('IMAGE.NOT_IMAGE'), 'Ok', { duration: 5000 });
      this.imageLoad = false;
      return;
    }
    if ($event.dataTransfer.files[0].size > 2000000) {
      this.matSnackbar.open(this.translateService.instant('IMAGE.OVERSIZE'), 'Ok', { duration: 5000 });
      this.imageLoad = false;
      return;
    }
    this.imageFile = $event.dataTransfer.files[0];
  }

  onDragOver($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  imageCropped($event: ImageCroppedEvent) {
    this.croppedImage = $event.file;
  }

  close() {
    this.dialogRef.close(this.croppedImage);
  }

  imageLoaded() {
    this.imageLoad = false;
  }

  cropperReady() {
   // this.imageLoad = false;
  }

}


@Component({
  template: '<i class="ft-alert-triangle"></i> Unavailable'
})

export class ImageErrorSnackBarComponent {
}
