import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupConfigurationService} from '../../../../../shared/services/group-configuration.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-configuration-mgm',
  templateUrl: './configuration-mgm.component.html',
  styleUrls: ['./configuration-mgm.component.scss']
})
export class ConfigurationMgmComponent implements OnInit {
  configForm: FormGroup;

  constructor(private fb: FormBuilder,
              private groupConfigurationService: GroupConfigurationService,
              private matSnackbar: MatSnackBar,
              private translateService: TranslateService) {
  }

  ngOnInit() {
  }

  save() {
    this.groupConfigurationService.update(this.configForm.value).subscribe(() => {
      this.matSnackbar.open(this.translateService.instant('ADMIN.GROUP.UPDATED_SUCCESS'), 'Ok', {duration: 5000});
      this.groupConfigurationService.getCurrentGroupConfig().subscribe(d => {
        if (d) {
          this.configForm.patchValue(d);
        }
      });
    });
  }
}
