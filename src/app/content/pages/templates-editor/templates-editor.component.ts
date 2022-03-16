import {Component, OnInit, ViewChild} from '@angular/core';
import {EmailEditorComponent} from 'angular-email-editor';
import {MatDialog, MatSnackBar} from '@angular/material';
import {PromoService} from '../../../shared/services/promo.service';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {ImageService} from '../../../shared/services/image.service';
import {ActivatedRoute} from '@angular/router';
import {PromoModel} from '../../../shared/models/promo-model';
import {FormControl} from '@angular/forms';
import {BLANK_MAIL} from '../promo-template-editor/blank-mail';
import * as Swal from 'sweetalert2';
import {PromotionDetailsFormComponent} from './promotion-details-form.component';

@Component({
  selector: 'app-templates-editor',
  templateUrl: './templates-editor.component.html',
  styleUrls: ['./templates-editor.component.scss']
})
export class TemplatesEditorComponent implements OnInit {
  title = 'angular-email-editor';

  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;
  promoModels: PromoModel[] = [];
  modelsFormControl = new FormControl();
  loadedModel: PromoModel;
  private editor: any;
  cropperOpen = false;

  constructor(
    private matDialog: MatDialog,
    private promoModelService: PromoService,
    private breadcrumbService: BreadcrumbService,
    private snackbar: MatSnackBar,
    private translateService: TranslateService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['TEMPLATE_PROMO']);
    this.modelsFormControl.valueChanges.subscribe(v => {
      if (v) {
        this.promoModelService.getPromoModelById(v).subscribe(data => {
          this.loadedModel = data;
          if (data.design) {
            this.emailEditor.editor.loadDesign(JSON.parse(data.design));
          } else {
            this.emailEditor.editor.loadDesign(BLANK_MAIL);
          }
        });
      } else {
        this.emailEditor.editor.loadDesign(BLANK_MAIL);
      }
    });
    this.loadPromoTemplates();
  }


  loadPromoTemplates() {
    this.promoModelService.getPromoModelsLight().subscribe(d => {
      this.promoModels = d.data;
      const templateId = this.activatedRoute.snapshot.queryParamMap.get('templateId');
      if (templateId) {
        // tslint:disable-next-line:radix
        this.modelsFormControl.patchValue(Number.parseInt(templateId));
      }
    });
  }

  editorLoaded(event) {
    // load the design json here
    // this.emailEditor.editor.loadDesign({});
  }

  exportHtml() {
    this.emailEditor.editor.exportHtml((data) => console.log('exportHtml', data));
  }

  getPostImageSection(design) {
    console.log(design);
    const body = design.body;
    return body.rows[1].columns[0].contents;
  }

  getPostTextSection(design) {
    const body = design.body;
    return body.rows[2].columns[0].contents;
  }

  save(event) {
    this.emailEditor.editor.exportHtml((data: any) => {
      // const postImageUrl = this.getPostImageSection(data.design)[0].values.src.url;
      // const htmlPost = this.getPostTextSection(data.design)[0].values.text;
      // const orginialText = new DOMParser().parseFromString(htmlPost, 'text/html').documentElement.textContent;
      // const postText = orginialText.replace(/(<([^>]+)>)/gi, '');
      this.promoModelService.updateModel({
        ...this.loadedModel,
        template: data.html,
        design: JSON.stringify(data.design),
        // postText,
        // postImageUrl
      }).subscribe(id => {
        Swal.default.fire({
          icon: 'success',
          text: this.translateService.instant('PROMO_EDITOR.TEMPLATE_SAVED'),
          showConfirmButton: false,
          timer: 2500
        });
        this.loadPromoTemplates();
        this.modelsFormControl.setValue(id);
      }, error => {
        this.snackbar.open('Server Error', 'Ok');
      });
    });
  }

  openForm(edit) {
    this.matDialog.open(PromotionDetailsFormComponent, {
      width: '500px',
      disableClose: true,
      data: edit ? this.promoModels.find(u => u.id === this.modelsFormControl.value) : null
    }).afterClosed().subscribe(d => {
      if (d) {
        this.loadPromoTemplates();
        this.modelsFormControl.setValue(d === 'DELETE' ? null : d);
      }
    });
  }
}
