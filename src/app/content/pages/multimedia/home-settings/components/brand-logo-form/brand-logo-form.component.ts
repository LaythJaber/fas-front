import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {BrandService} from "../../../../../../shared/services/brand.service";
import {FormControl, Validators} from "@angular/forms";
import {MultimediaService} from "../../../../../../shared/services/multimedia.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-brand-logo-form',
  templateUrl: './brand-logo-form.component.html',
  styleUrls: ['./brand-logo-form.component.scss']
})
export class BrandLogoFormComponent implements OnInit {
  imageFileResult: string | ArrayBuffer;
  brands: any;
  brandFormCtrl = new FormControl(null, Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private brandService: BrandService,
    private matDialogRef: MatDialogRef<BrandLogoFormComponent>,
    private multimediaService: MultimediaService
  ) {
  }

  ngOnInit() {
    this.brandService.getLazyBrands({page: null, pageSize: null}).subscribe(brandsPage => {
      this.brands = brandsPage.data
    });
    if (!this.data.editMode) {
      this.readImageFile()
    } else {
      this.brandFormCtrl.setValue(this.data.logo.brandId);
      this.imageFileResult = this.data.logo.logoUrl;
    }
  }

  private readImageFile() {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imageFileResult = fileReader.result;
    };
    fileReader.readAsDataURL(this.data.imageFile);
  }

  save() {
    if (!this.data.editMode) {
      const formData = new FormData();
      formData.append('brandLogoImage', this.data.imageFile);
      const request = {
        brandId: this.brandFormCtrl.value,
      }
      formData.append('brandLogoRequest', new Blob([JSON.stringify(request)], {type: 'application/json'}));
      this.multimediaService.addBrandLogo(formData).subscribe(res => {
        this.matDialogRef.close(res);
      });
    } else {
      this.multimediaService.updateBrandLogo({
        id: this.data.logo.id,
        brandId: this.brandFormCtrl.value
      }).subscribe(() => {
        this.matDialogRef.close(true);
      });
    }
  }
}
