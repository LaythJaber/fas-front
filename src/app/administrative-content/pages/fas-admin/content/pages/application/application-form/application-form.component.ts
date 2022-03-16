import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApplicationService} from "../../../../../../../shared/services/application.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomSnackBarComponent} from "../../../../../../../shared/compoenent/custom-snack-bar/custom-snack-bar.component";
import {ReturnProductConfig} from "../../../../../../../shared/models/return-product/return-product-config";
import {Application} from "../../../../../../../shared/models/application.model";

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  appForm: FormGroup;
  @Input() title: string
  @Input() application: Application;
  edit = false;

  constructor(public activeModal: NgbActiveModal,
              public applicationService: ApplicationService,
              public snackBar: MatSnackBar,
  ) {

  }


  save(){

    const newApplication: Application = {
      ...this.appForm.getRawValue()
    };
    this.applicationService.update(newApplication).subscribe(r=>{

      if (this.edit) {
        this.showSnackBar({
          text: r.programName,
          actionIcon: 'save',
          actionMsg: "Updated successfully"
        });
      } else {
        this.showSnackBar({
          text: r.programName,
          actionIcon: 'save',
          actionMsg: "Added successfully"
        });
      }

      this.activeModal.close(r);
    });


  }


  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }

  ngOnInit() {


    this.appForm = new FormGroup({
      id: new FormControl(null),
      createdAt: new FormControl(null, Validators.required),
      programName: new FormControl(null,Validators.required),
      status: new FormControl(null),
      country: new FormControl(null,Validators.required),

    });

    this.appForm.controls.createdAt.setValue(new Date());

    if (this.application) {
      this.edit = true;
      this.appForm.patchValue(this.application);
    }

  }

}
