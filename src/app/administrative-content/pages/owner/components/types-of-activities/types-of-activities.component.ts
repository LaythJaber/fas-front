import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TypesOfActivitiesFormComponent} from './types-of-activities-form.component';
import {CompanyBusinessService} from '../../../../../shared/services/company-business.service';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-type-of-activities',
  templateUrl: './types-of-activities.component.html',
  styleUrls: ['./types-of-activities.component.scss']
})
export class TypesOfActivitiesComponent implements OnInit {
  typesOfActivities = [];

  constructor(
    private matDialog: MatDialog,
    private companyBusinessService: CompanyBusinessService,
    private sweetAlterService: SweetAlertService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.companyBusinessService.getAllCompanyBusinesses().subscribe(d => {
      this.typesOfActivities = d;
    });
  }

  openFormDialog(activity?) {
    this.matDialog.open(TypesOfActivitiesFormComponent, {width: '550px', disableClose: true, data: {editMode: !!activity, activity}})
      .afterClosed().subscribe(r => {
      if (r) {
        this.loadData();
      }
    });
  }

  delete(activity: any) {
    this.sweetAlterService.warning(this.translateService.instant('ADMIN.TYPES_ACTIVITIES.DELETE_MSG') + ' ' + activity.description)
      .then(u => {
        if (u.value) {
          this.companyBusinessService.delete(activity.id).subscribe(() => {
            this.loadData();
          });
        }
      });
  }
}
