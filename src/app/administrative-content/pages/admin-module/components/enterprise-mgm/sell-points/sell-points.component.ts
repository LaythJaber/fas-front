import { SweetAlertService } from './../../../../../../shared/services/sweet-alert.service';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellPointService } from '../../../../../../shared/services/sell-point.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SellPointFormComponent } from './sell-point-form/sell-point-form.component';
import { SellPoint } from '../../../../../../shared/models/sell-point';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../../../shared/services/user.service';
import { Enterprise } from 'src/app/shared/models/enterprise';
import { EnterpriseService } from 'src/app/shared/services/enterprise.service';
import { CustomSnackBarComponent } from 'src/app/shared/compoenent/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-point-of-sales',
  templateUrl: './sell-points.component.html',
  styleUrls: ['./sell-points.component.scss']
})
export class SellPointsComponent implements OnInit, OnDestroy {
  @Input() enterprise: Enterprise;
  sellPointsList: SellPoint[] = [];
  unsubscribe$ = new Subject();
  loading = false;
  currentUser;
  isOwner: boolean;
  columns = [
    'DATA_TABLE.ID',
    'ADMIN.ENTERPRISE.COMPANY_NAME',
    'ADMIN.SELL_POINT.OPENING_HOUR',
    'ADMIN.SELL_POINT.FINAL_HOUR',
    'ADMIN.SELL_POINT.MOBILE',
    ''
  ];
  constructor(
    private route: ActivatedRoute,
    private sellPointService: SellPointService,
    private enterpriseService: EnterpriseService,
    private matDialog: MatDialog,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private userService: UserService,
    private translate: TranslateService,
    private sweetAlertService: SweetAlertService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.isOwner = this.userService.getUser().authorities.some(u => u === 'OWNER');
    this.enterpriseService.getEnterpriseById(this.enterprise.id).subscribe(d => {
      this.enterprise = d;
    });
    this.loading = true;
    this.sellPointService.getSellPointsByEnterprise(this.enterprise.id).subscribe(u => {
      this.sellPointsList = u;
      this.loading = false;
    });

    this.currentUser = this.localStorageService.retrieve('user') || this.sessionStorageService.retrieve('user');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  openAddSellPoint() {
    const dialogRef = this.matDialog.open(SellPointFormComponent, {
      width: '1200px',
      disableClose: true,
      autoFocus: false,
      data: { editMode: false, enterprise: this.enterprise }
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.loading = true;
        this.sellPointService.getSellPointsByEnterprise(this.enterprise.id).subscribe(u => {
          this.sellPointsList = u;
          this.loading = false;
        });
      }
    });
  }

  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }

  openEditSellPoint(sellPoint) {
    const dialogRef = this.matDialog.open(SellPointFormComponent, {
      width: '1200px',
      disableClose: true,
      autoFocus: false,
      data: { editMode: true, enterprise: this.enterprise, sellPoint }
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.loading = true;
        const entId = this.enterprise ? this.enterprise.id : this.route.snapshot.params.enterpriseId;
        this.sellPointService.getSellPointsByEnterprise(entId).subscribe(u => {
          this.sellPointsList = u;
          this.loading = false;
        });
      }
    });
  }

  chooseSellPoint(sp: SellPoint) {
    const tokenStorageKey = 'authenticationToken';
    this.sellPointService.chooseSellPoint(sp.id).subscribe(resp => {
      if (this.localStorageService.retrieve(tokenStorageKey)) {
        this.localStorageService.store(tokenStorageKey, resp.token);
      } else {
        this.sessionStorageService.store(tokenStorageKey, resp.token);
      }
      if (this.matDialog) {
        this.matDialog.closeAll();
      }
      this.router.navigate(['/']);
    });
  }

  deleteSellPoint(sp: SellPoint) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE')).then(e => {
      if (e.value) {

    this.sellPointService.deleteSellPoint(sp.id).subscribe(d => {
      this.sellPointService.getSellPointsByEnterprise(this.enterprise.id).subscribe(u => {
        this.sellPointsList = u;
        this.loading = false;
      });
    }, (err: HttpErrorResponse) => {
      if (err.error.message.includes('ConstraintViolationException')) {
        this.matSnackBar.open(this.translateService.instant('ADMIN.SELL_POINT.CANNOT_DELETE'), 'Ok', {
          duration: 5000,
          panelClass: 'white-snackbar',
        });
      }
    });
  }
});

  }
}
