import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductResourceService} from "../../../../../shared/services/product/product-resource.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ProductResourceRequest} from "../../../../../shared/models/product/product-resource-request";
import {ColorService} from "../../../../../shared/services/color.service";
import {Color} from "../../../../../shared/models/color";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-product-image-form',
  templateUrl: './product-image-form.component.html',
  styleUrls: ['./product-image-form.component.scss']
})
export class ProductImageFormComponent implements OnInit {

  imageFileResult;

  colors: Color[] = [];
  productResourceForm: FormGroup;
  imageInLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private matDialogRef: MatDialogRef<ProductImageFormComponent>,
    private productResourceService: ProductResourceService,
    private colorService: ColorService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.initForms();
    this.getColors();
  }

  ngOnInit() {
    this.readImageFile();
  }

  initForms() {
    this.productResourceForm = new FormGroup({
      colorId: new FormControl(null)
    });
  }

  private readImageFile() {
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      this.imageFileResult = fileReader.result;
    };
    fileReader.readAsDataURL(this.data.file);
  }

  getColors() {
    this.colorService.getLazyColors({page: 1, pageSize: 10000}).subscribe((response) => {
      this.colors = response.data;
    })
  }

  uploadImage() {
    this.imageInLoading = true;
    const formData = new FormData();
    formData.append('resources', this.data.file, this.data.file.name);
    const request: ProductResourceRequest = new ProductResourceRequest();
    request.productId = this.data.productId;
    request.colorId = this.productResourceForm.controls.colorId.value;
    request.type = 'LOCAL';
    formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));

    this.productResourceService.uploadProductResources(formData).subscribe(
      (r) => {
        console.log('res add image 1 = ', r)
        this.imageInLoading = false;
        this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.matDialogRef.close(true);
      },
      (error) => {
        this.imageInLoading = false;
        console.log('change error = ', error);
        this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
      });
  }

}
