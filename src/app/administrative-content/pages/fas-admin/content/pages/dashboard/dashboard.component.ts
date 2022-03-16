import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../../../../core/services/breadcrumb.service';
import {DashboardService} from '../../../../../../shared/services/dashboard.service';
import {Application} from "../../../../../../shared/models/application.model";
import {ApplicationService} from "../../../../../../shared/services/application.service";
import {StudentService} from "../../../../../../shared/services/student.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  applications: Application[];
  totalApps = 0;
  totalUsers = 0;
  acceptedUsers = 0;
  constructor(private breadcrumbService: BreadcrumbService,
              private studentService: StudentService,
              private applicationService: ApplicationService) {
  }

  ngOnInit() {
    this.sendBreadCrumb();
    this.countApps();
    this.countUsers();
    this.countAcceptedUsers();
    this.getApps();

  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['DASHBOARD']);
  }



  getApps() {
    this.applicationService.getApplications().subscribe( response => {
      this.applications = response;
    })
  }

  countUsers() {
    this.studentService.countStudents().subscribe( response => {
      this.totalUsers = response;
    })
  }

  countAcceptedUsers() {
    this.studentService.countAcceptedStudents().subscribe( response => {
      this.acceptedUsers = response;
    })
  }

  countApps() {
    this.applicationService.countApplications().subscribe( response => {
      this.totalApps = response;
    })
  }
}
