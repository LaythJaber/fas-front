import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {MultimediaService} from "../../../../../../shared/services/multimedia.service";

@Component({
  selector: 'app-carousel-form',
  templateUrl: './carousel-form.component.html',
  styleUrls: ['./carousel-form.component.scss']
})
export class CarouselFormComponent implements OnInit {
  imageFileResult;
  linkFormControl = new FormControl();
  saveProgress = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private multimediaService: MultimediaService,
    private matDialogRef: MatDialogRef<CarouselFormComponent>
  ) { }

  ngOnInit() {
    if (this.data.carousel) {
      this.imageFileResult = this.data.carousel.url;
      this.linkFormControl.setValue(this.data.carousel.link);
    } else {
      this.readImageFile();
    }
  }

  private readImageFile() {
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      this.imageFileResult = fileReader.result;
    };
    fileReader.readAsDataURL(this.data.file);
  }

  save() {
    if (this.data.carousel) {
      const request = {
        id: this.data.carousel.id,
        link: this.linkFormControl.value,
      };
      this.multimediaService.updateCarouselImage(request).subscribe(() => {
          this.matDialogRef.close(true);
      });

    } else {

      const formData = new FormData();
      const request = {
        link: this.linkFormControl.value,
        index: this.data.index,
      };
      formData.append('carouselRequest', new Blob([JSON.stringify(request)], {type: 'application/json'}));
      formData.append('carouselImage', this.data.file);
      this.multimediaService.addCarouselImage(formData).subscribe(res => {
        if (res.type === HttpEventType.UploadProgress) {
          this.saveProgress = (res.loaded / res.total) * 100;
        }
        if (res.type === HttpEventType.Response) {
          this.matDialogRef.close(res.body);
        }
      });

    }
  }
}
