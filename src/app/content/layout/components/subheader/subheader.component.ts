import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'subheader',
	templateUrl: './subheader.component.html',
	styleUrls: ['./subheader.component.css']
})
export class SubheaderComponent implements OnInit {

    @Input() title : string;
    @Input() breadcrumb : any[];

    constructor() { }

    ngOnInit() {
    }
}
