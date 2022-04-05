import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {ApplicationService} from "../../../shared/services/application.service";
import {StudentService} from "../../../shared/services/student.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  acceptedApplications = 0;
  rejectedApplications = 0;
  totalApplications= 0;

  constructor(private breadcrumbService: BreadcrumbService,
              private applicationService: ApplicationService,
              private studentService: StudentService,) {
  }

  ngOnInit() {
    this.sendBreadCrumb();
    this.countTotalApplicationsByUser();
    this.countAcceptedApplications();
    this.countRejectedApplications();

  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['DASHBOARD']);
  }



  countAcceptedApplications() {
    this.studentService.countAcceptedApplicationsByUser().subscribe( response => {
      this.acceptedApplications = response;
    })
  }

  countTotalApplicationsByUser() {
    this.studentService.countTotalApplicationsByUser().subscribe( response => {
      this.totalApplications = response;
    })
  }

  countRejectedApplications() {
    this.studentService.countRejectedApplicationsByUser().subscribe( response => {
      this.rejectedApplications = response;
    })
  }


}
