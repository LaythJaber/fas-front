import { Component, OnInit } from '@angular/core';
import {ApplicationFormComponent} from "./application-form/application-form.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BreadcrumbService} from "../../../../../../core/services/breadcrumb.service";
import {Application} from "../../../../../../shared/models/application.model";
import {ApplicationService} from "../../../../../../shared/services/application.service";
import * as Swal from 'sweetalert2';
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {


  applications: Application[];

  constructor(private modalService: NgbModal,
              private applicationService: ApplicationService,
              private breadcrumbService: BreadcrumbService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.sendBreadCrumb();
    this.getApps();
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['APPLICATIONS']);
  }

  add() {
    const modalRef = this.modalService.open(ApplicationFormComponent);
    modalRef.componentInstance.title = this.translate.instant('APPLICATIONS.NEW_APP');
    modalRef.result.then((result) => {if (result) { this.applications.push(result) }});

  }

  edit(app: Application) {
    const modalRef = this.modalService.open(ApplicationFormComponent);
    modalRef.componentInstance.application = app;
    modalRef.componentInstance.title = this.translate.instant('APPLICATIONS.UPDATE_APP');;

    modalRef.result.then((result) => { if (result) {

      const foundIndex = this.applications.findIndex(x => x.id == result.id);
      this.applications[foundIndex] = result;
    }
    });

  }

  getApps() {
     this.applicationService.getApplications().subscribe( response => {
       this.applications = response;
     })

  }



  private deleteApp(app: Application, i) {
      Swal.default.fire({
        title: "DELETE APPLICATION",
        icon: 'warning',
        text: 'Are you sure, you want to delete ' + app.programName  ,
        showCancelButton: true,
        confirmButtonColor: '#2B333D',
        cancelButtonColor: '#E38932'
      }).then(e => {
        if (e.value) {
          this.applicationService.deleteApp(app.id).subscribe(d =>
              this.applications.splice(i, 1)
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
