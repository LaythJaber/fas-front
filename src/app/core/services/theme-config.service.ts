import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ThemeConfig } from 'src/app/shared/config';

@Injectable({
    providedIn: 'root'
})
export class ThemeConfigService {

    public config: any;
    public _configSubject: BehaviorSubject<any>;

    constructor() {
        this.config = ThemeConfig;
        this._configSubject = new BehaviorSubject(this.config);
    }

    setModel(model: any) {
        this.config = Object.assign({}, this.config, model);
        this._configSubject.next(this.config);
    }

}
