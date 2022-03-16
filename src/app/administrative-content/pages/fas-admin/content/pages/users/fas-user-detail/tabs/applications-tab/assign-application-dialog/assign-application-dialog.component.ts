import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Application} from "../../../../../../../../../../shared/models/application.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ApplicationService} from "../../../../../../../../../../shared/services/application.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomSnackBarComponent} from "../../../../../../../../../../shared/compoenent/custom-snack-bar/custom-snack-bar.component";
import {StudentService} from "../../../../../../../../../../shared/services/student.service";
import {element} from "protractor";
import {UserApplications} from "../../../../../../../../../../shared/models/user-applications";

@Component({
  selector: 'app-assign-application-dialog',
  templateUrl: './assign-application-dialog.component.html',
  styleUrls: ['./assign-application-dialog.component.scss']
})
export class AssignApplicationDialogComponent implements OnInit {

  @Input() title: string
  @Input() userId: number;
  @Input() userApplications: UserApplications[];


  applications: Application[];

  selectedApplication: number;
  constructor(public activeModal: NgbActiveModal,
              public applicationService: ApplicationService,
              public studentService: StudentService,
              public snackBar: MatSnackBar,
  ) {

  }


  assign(){

    this.studentService.assignApp(this.userId, this.selectedApplication).subscribe(r=> {

        this.showSnackBar({
          text: this.selectedApplication,
          actionIcon: 'save',
          actionMsg: " Assigned successfully"
        });

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

    this.getApps();
  }



  getApps() {
    this.applicationService.getApplications().subscribe( response => {
      this.applications = response.filter( element => !this.userApplications.some(e2 => element.id === e2.application.id));
      });



  }
}
