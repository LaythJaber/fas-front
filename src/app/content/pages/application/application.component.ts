import { Component, OnInit } from '@angular/core';
import {ApplicationFormComponent} from "./application-form/application-form.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Application} from "../../../shared/models/application.model";
import {BreadcrumbService} from "../../../core/services/breadcrumb.service";
import {StudentService} from "../../../shared/services/student.service";
import {UserApplications} from "../../../shared/models/user-applications";

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {


  applications: UserApplications[] = [];

  constructor(private modalService: NgbModal,
              private breadcrumbService: BreadcrumbService,
              private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.sendBreadCrumb();
    this.getAppsByUser();
    this.getUsers();
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['APPLICATIONS']);
  }

  add() {
    const modalRef = this.modalService.open(ApplicationFormComponent);
    modalRef.componentInstance.user = 'World';
  }

  edit() {
    const modalRef = this.modalService.open(ApplicationFormComponent);
    modalRef.componentInstance.user = 'World';
  }

  getUsers() {

  }

  getAppsByUser() {

    this.studentService.getStudentApplications().subscribe( response => {

      this.applications = response;
    })
  }
}
