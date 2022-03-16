import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {DashboardService} from '../../../shared/services/dashboard.service';
import {ApplicationFormComponent} from "../application/application-form/application-form.component";
import {Application} from "../../../shared/models/application.model";
import {ApplicationService} from "../../../shared/services/application.service";
import {StudentService} from "../../../shared/services/student.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  acceptedApplications = 0;
  inscriptionPerDay = 0;
  purchasePerDay = 0;
  finishedLastImport= false;
  applications: Application[];

  constructor(private breadcrumbService: BreadcrumbService,
              private applicationService: ApplicationService,
              private studentService: StudentService,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.sendBreadCrumb();
    this.getApps();
    this.countAcceptedApplications();

  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['DASHBOARD']);
  }


  getApps() {
    this.applicationService.getApplications().subscribe( response => {
      this.applications = response;
    })
  }

  countAcceptedApplications() {
    this.studentService.countAcceptedStudents().subscribe( response => {
      this.acceptedApplications = response;
    })
  }
}
