import { Component, OnInit } from '@angular/core';
import {Application} from "../../../../../../shared/models/application.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BreadcrumbService} from "../../../../../../core/services/breadcrumb.service";
import {ApplicationFormComponent} from "../application/application-form/application-form.component";
import {StudentService} from "../../../../../../shared/services/student.service";
import {Account} from "../../../../../../shared/models/account.model";
import {Student} from "../../../../../../shared/models/student";
import {Router} from "@angular/router";


@Component({
  selector: 'app-users',
  templateUrl: './fas-users.component.html',
  styleUrls: ['./fas-users.component.scss']
})
export class FasUsersComponent  implements OnInit{


  users: Student[];

  constructor(private modalService: NgbModal,
              private breadcrumbService: BreadcrumbService,
              private studentService: StudentService,
              private router: Router ) {
  }

  ngOnInit(): void {
    this.sendBreadCrumb();
    this.getUsers();

  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['USERS']);
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
    this.studentService.getStudents().subscribe( result => {
      console.log(result)
      this.users = result;

    })
  }

  userDetails(userId: number) {

    this.router.navigate(['fas-admin/fas-users/details', userId]);

  }

  changeAccountStatus(user: Student, index: number) {

    this.studentService.changeAccountStatus(user.id).subscribe(d => {
      switch (this.users[index].status) {
        case 'ACCEPTED': {
          this.users[index].status = 'BLOCKED';
          break;
        }
        case 'PENDING': {
          this.users[index].status = 'ACCEPTED';
          break;
        }
        case 'BLOCKED': {
          this.users[index].status = 'PENDING';
          break;
        }
      }
    });
  }

}
