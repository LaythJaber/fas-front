import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UpdateFaqComponent} from "./update-faq.component";
import {MatDialog} from "@angular/material";
import {FaqService} from "../../../../shared/services/faq.service";
import {Module} from "../../../../shared/models/module";
import {Qa} from "../../../../shared/models/Qa";
import {TranslateService} from "@ngx-translate/core";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {Language} from "../../../../shared/enum/language.enum";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  languages=[];
  qas: Qa[] = [];
  modules: Module[] = [];
  searchText = new FormControl(null);
  activeModuleId: number=0;
  moduleRef: any;
  moduleForm: FormGroup;
  editMode: boolean;
  active = new FormControl(null);
  constructor(private matDialog: MatDialog,
              private faqService: FaqService,
              private translate: TranslateService,
              private sweetAlertService: SweetAlertService,
  ) {
  }

  ngOnInit() {
    this.translateLanguages();
    this.moduleForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      langEnum: new FormControl()
    });
    this.getAllModules();
    this.activeModuleId = 0;
    this.getFaqsByModule(this.activeModuleId);

    this.faqService.updateFaq(null).subscribe(r=>{
      this.active.setValue(r.active, { emitEvent: false });
    });

    this.active.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.faqService.updateFaq({active: s}).subscribe(r=>{
      });
    });

    this.searchText.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      console.log(s);
      this.activeModuleId = 0;
      if(s != null && s.length>0) {
        this.faqService.getQaBySearch(s).subscribe(r => {
          this.qas = r;
        });
      }else{
        this.getFaqsByModule(this.activeModuleId);
      }
    });
  }

  getAllModules() {
    this.faqService.getAllModules().subscribe(res => {
      this.modules = res;
    });
  }

  newQAModal() {
    const dialogRef = this.matDialog.open(UpdateFaqComponent, {
      width: '800px',
      height:' 90%',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        console.log(this.activeModuleId);
        this.getFaqsByModule(this.activeModuleId);
      }
    });
  }

  newModule(moduleContent) {
    this.moduleRef = this.matDialog.open(moduleContent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      // data: {editMode: false}
    });
    this.moduleRef.afterClosed().subscribe(d => {
      this.moduleForm.reset();
    });
  }

  getFaqsByModule(moduleId) {
    this.searchText.setValue(null, {emitEvent: false});
    this.activeModuleId = moduleId;
    this.faqService.getAllQas(moduleId ? moduleId : 0).subscribe(r => {
      console.log(r);
      this.qas = r;
    });
  }


  saveModule() {
    this.faqService.updateModule(this.moduleForm.getRawValue()).subscribe(r => {
      this.moduleRef.close();
      this.getAllModules();

    });
  }

  editModule($event, module, moduleContent) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.moduleForm.patchValue(module);
    this.editMode = true
    this.moduleRef = this.matDialog.open(moduleContent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      // data: {editMode: true}
    });
    this.moduleRef.afterClosed().subscribe(d => {
      this.editMode = false
      this.moduleForm.reset();
      this.getAllModules();
      this.getFaqsByModule(this.activeModuleId);
    });
  }

  deleteModule($event, module) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + module.name).then(e => {
      if (e.value) {
        this.faqService.deleteModule(module.id).subscribe(r => {
          if (module.id === this.activeModuleId) {
            this.qas = [];
          }
          this.getAllModules();
          this.getFaqsByModule(this.activeModuleId);
        });
      }
    });
  }

  deleteQa($event, qa) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + 'Q&A').then(e => {
      if (e.value) {
        this.faqService.deleteQa(qa.id).subscribe(r => {
          this.getFaqsByModule(this.activeModuleId);
        });
      }
    });
  }

  editQa($event, qa) {
    const dialogRef = this.matDialog.open(UpdateFaqComponent, {
      width: '800px',
      height:' 90%',
      autoFocus: true,
      disableClose: true,
      data: {editMode: true, qa: qa}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        console.log(this.activeModuleId);
        this.getFaqsByModule(this.activeModuleId);
      }
    });
  }

  translateLanguages(){
    this.languages = [{ description: Language.en, id: Language.en },
      { description: Language.es, id: Language.es },
      { description: Language.fr, id: Language.fr },
      { description: Language.it, id: Language.it }];
  }
}
