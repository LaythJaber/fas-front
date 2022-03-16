import {Component, Input, OnInit} from '@angular/core';
import {Application} from "../../../../../../../../../shared/models/application.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ApplicationService} from "../../../../../../../../../shared/services/application.service";
import {ApplicationFormComponent} from "../../../../application/application-form/application-form.component";
import {AssignApplicationDialogComponent} from "./assign-application-dialog/assign-application-dialog.component";
import {StudentService} from "../../../../../../../../../shared/services/student.service";
import * as Swal from 'sweetalert2';
import {UserApplications} from "../../../../../../../../../shared/models/user-applications";

@Component({
  selector: 'app-applications-tab',
  templateUrl: './applications-tab.component.html',
  styleUrls: ['./applications-tab.component.scss']
})
export class ApplicationsTabComponent implements OnInit {

  @Input() applications: UserApplications[] = [];

  @Input() userId: number;

  constructor(private modalService: NgbModal,
              private applicationService: ApplicationService,
              private studentService: StudentService) { }

  ngOnInit() {
  }





  assign() {
    const modalRef = this.modalService.open(AssignApplicationDialogComponent);
    modalRef.componentInstance.title = 'Assign Application';
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.userApplications = this.applications;
    modalRef.result.then((result) => {if (result) { this.applications.push(result)}});

  }

  changeApplicationStatus(application: Application, index: number) {

    this.studentService.changeApplicationStatus(this.userId, application.id).subscribe(d => {
      switch (this.applications[index].status) {
        case 'ACCEPTED': {
          this.applications[index].status = 'REJECTED';
          break;
        }
        case 'PENDING': {
          this.applications[index].status = 'ACCEPTED';
          break;
        }
        case 'REJECTED': {
          this.applications[index].status = 'PENDING';
          break;
        }
      }
    });
  }



   detachApp(application: Application, index: number) {
    Swal.default.fire({
      title: "DETACH APPLICATION",
      icon: 'warning',
      text: 'Are you sure, you want to detach ' + application.programName  ,
      showCancelButton: true,
      confirmButtonColor: '#2B333D',
      cancelButtonColor: '#E38932'
    }).then(e => {
      if (e.value) {
        this.studentService.detachApp(this.userId, application.id).subscribe(d =>
            this.applications.splice(index, 1)
          , error => {
            Swal.default.mixin({
              toast: true,
              position: 'bottom-end',
              timer: 4000,
              timerProgressBar: true,
            }).fire({
              icon: 'error',
              showConfirmButton: false,
              title: 'Error',
              text: 'error'
            });
          });
      }
    });
  }

}
