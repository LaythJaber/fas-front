import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {SellPoint} from "../../../../shared/models/sell-point";
import {SellPointService} from "../../../../shared/services/sell-point.service";
import {CartConfigurationService} from "../../../../shared/services/cart-configuration.service";
import {Language} from "../../../../shared/models/language";
import {LanguageService} from "../../../../shared/services/language.service";
import {CartConfigurationTranslation} from "../../../../shared/models/cart/cart-configuration-translation";

@Component({
  selector: 'app-carts-config',
  templateUrl: './carts-config.component.html',
  styleUrls: ['./carts-config.component.scss']
})
export class CartsConfigComponent implements OnInit {
  cartConfigForm: FormGroup;
  sellPointList: SellPoint[] = [];
  sellPointId: any;

  selectedTab: number;
  languageList: Language[];

  constructor(
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    public sellPointService: SellPointService,
    public cartConfigurationService: CartConfigurationService,
    private languageService: LanguageService,
  ) {
    this.initCartConfigForm();
    this.getLanguageList();
  }

  ngOnInit() {
    this.getSellPointList();
  }

  initCartConfigForm() {
    this.cartConfigForm = this.fb.group({
      id: null,
      sellPointId: null,
      replaceableCheck: null,
      minimumCheck: null,
      minimumCart: null,
    });
  }

  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      this.selectedTab = this.languageList.findIndex(u => u.code === this.translateService.currentLang);
      this.initTransInfoArrayForm();
    });
  }

  initTransInfoArrayForm(trans: CartConfigurationTranslation[] = []) {
    this.cartConfigForm.removeControl('transInfo');
    const transInfo = this.fb.array(
      this.languageList.map(l => {
        const obj = trans.find(t => t.language.code == l.code);
        return new FormGroup({
          id: new FormControl(obj ? obj.id : null),
          language: new FormControl({id: l.id, code: l.code}),
          replaceDescription: new FormControl(obj ? obj.replaceDescription : null),
        });
      })
    );
    this.cartConfigForm.addControl('transInfo', transInfo);
  }

  getSellPointList() {
    this.sellPointService.getAllSellPoints().subscribe((response) => {
      this.sellPointList = response;
    });
  }

  setSellPoint($event) {
    console.log($event.id);
    this.sellPointId = $event.id;
    this.cartConfigurationService.getConfigurationBySellPoint(this.sellPointId).subscribe(res => {
      console.log("cart Config for selected sellpoint  = ", res);
      console.log("clangs = ", this.languageList);
      this.cartConfigForm.patchValue(res);
      this.cartConfigForm.get('sellPointId').setValue(this.sellPointId);
      this.initTransInfoArrayForm(res.transInfo);
    })
  }

  save() {
    this.cartConfigurationService.update(this.cartConfigForm.value).subscribe(() => {
        this.matSnackBar.open(
          this.translateService.instant('LOGIN_CONFIGURATION.UPDATED_SUCCESS'),
          'Ok',
          {duration: 1500}
        );
    });
  }

}
