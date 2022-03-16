import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupWithSuperAdmins} from '../../../../../../shared/models/group';
import {Moment} from 'moment';
import * as moment from 'moment';
import {OwnerService} from '../../../../../../shared/services/owner.service';

@Component({
  selector: 'app-date-mgm-form-modal',
  templateUrl: './date-mgm-form-modal.component.html',
  styleUrls: ['./date-mgm-form-modal.component.scss']
})
export class DateMgmFormModalComponent implements OnInit {
  dateForm: FormGroup;
  durationControl = new FormControl(null);
  customDuration = new FormControl(null, Validators.min(1));
  customDurationValue;
  remainingDays: number;
  totalDays: number;
  myFilter = (d: Moment | null): boolean => {
    // Prevent Saturday and Sunday from being selected.
    return d.isAfter(moment(this.dateForm.get('startDate').value, 'YYYY-MM-DD'));
  };

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: { group: GroupWithSuperAdmins },
    private ownerService: OwnerService,
    private matDialog: MatDialogRef<DateMgmFormModalComponent>
  ) {
  }

  ngOnInit() {
    this.dateForm = this.fb.group({
      id: this.data.group.id,
      startDate: [this.data.group.startDate, Validators.required],
      expirationDate: [this.data.group.expirationDate, Validators.required],
    });

    this.durationControl.valueChanges.subscribe(v => {
      this.dateForm.get('startDate').setValue(moment());
      this.dateForm.get('expirationDate').setValue(moment().add(v, 'days'));
      this.customDuration.setValue(null);
      this.customDurationValue = this.customDuration.value;
    });
    this.dateForm.valueChanges.subscribe(d => {
      this.calculateTotalAndRemainingDays();
    });
    this.calculateTotalAndRemainingDays();
  }

  saveForm() {
    const request = {
      id: this.dateForm.value.id,
      startDate: moment(this.dateForm.value.startDate).format('YYYY-MM-DD'),
      expirationDate: moment(this.dateForm.value.expirationDate).format('YYYY-MM-DD')
    };
    this.ownerService.editGroupValidationDate(request).subscribe(d => {
      this.matDialog.close(true);
    });
  }

  saveCustomDuration() {
    this.customDurationValue = this.customDuration.value;
    this.durationControl.setValue(null, {emitEvent: false});
    this.dateForm.get('startDate').setValue(moment());
    this.dateForm.get('expirationDate').setValue(moment().add(this.customDurationValue, 'days'));
  }

  calculateTotalAndRemainingDays() {
    this.totalDays = moment(this.dateForm.get('expirationDate').value).diff(moment(this.dateForm.get('startDate').value), 'days', true);
    this.remainingDays = moment(this.dateForm.get('expirationDate').value).diff(moment(), 'days', true);
  }
}
