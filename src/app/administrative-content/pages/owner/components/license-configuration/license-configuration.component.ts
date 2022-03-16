import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LicenseConfigFormComponent} from './license-config-form/license-config-form.component';
import {LicenseConfigurationService} from '../../../../../shared/services/license-configuration.service';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-license-configuration',
  templateUrl: './license-configuration.component.html',
  styleUrls: ['./license-configuration.component.scss']
})
export class LicenseConfigurationComponent implements OnInit {
  licensesConfigs;

  constructor(
    private matDialog: MatDialog,
    private licenseConfigService: LicenseConfigurationService,
    private sweetAlertService: SweetAlertService
  ) {
  }

  ngOnInit() {
    this.getLicenseConfiguration();
  }

  getLicenseConfiguration() {
    const request = {};
    this.licenseConfigService.getLazyLicensesConfigurations(request).subscribe(data => {
      this.licensesConfigs = data;
    });
  }

  openDialog(license?) {
    this.matDialog.open(LicenseConfigFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        editMode: license !== undefined,
        license
      },
    })
      .afterClosed().subscribe(d => {
      if (d) {
        this.getLicenseConfiguration();
      }
    });
  }

  delete(l: any) {
    this.sweetAlertService.warning('You are about to delete').then(
      u => {
        if (u.value) {
          this.licenseConfigService.delete(l.id).subscribe(() => {
            this.getLicenseConfiguration();
          });
        }
      }
    );
  }
}
