import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs: any[] = [];
  subscription: Subscription;

  constructor(private translateService: TranslateService,  private breadcrumbService: BreadcrumbService) {
    this.subscription = this.breadcrumbService.getBreadcrumb().subscribe(bc => {
      if (bc) {
        this.breadcrumbs = bc;
        console.log(bc);
      } else {
        // clear messages when empty message received
        this.breadcrumbs = [];
      }
    });

  }

  ngOnInit() {
  }

}
