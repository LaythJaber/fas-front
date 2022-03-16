import { Component, OnInit } from '@angular/core';

import { ThemeConfigService } from 'src/app/core/services/theme-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    public themeConfig: ThemeConfigService,
  ) { }

  ngOnInit() {
  }

}
