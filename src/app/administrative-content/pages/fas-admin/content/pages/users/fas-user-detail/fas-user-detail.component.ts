import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {BreadcrumbService} from "../../../../../../../core/services/breadcrumb.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StudentService} from "../../../../../../../shared/services/student.service";
import {Account} from "../../../../../../../shared/models/account.model";
import {MeetService} from "../../../../../../../shared/services/meet.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SharedDataService} from "../../../../../../../shared/services/shared-data.service";
import {CreateMeetDialogComponent} from "./create-meet-dialog/create-meet-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-fas-user-detail',
  templateUrl: './fas-user-detail.component.html',
  styleUrls: ['./fas-user-detail.component.scss']
})
export class FasUserDetailComponent implements OnInit {


  userId: number;
  student: Account;



  documentActive = true;
  dsActive = false;
  applicationsActive = false;



   /* meet variables */
  domain: string;
  options: any;
  api: any;
  dialogRef: any;
  formattedDate:any;
  cr:any;
  date = new Date();
  now = this.date.getDate()+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear();

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private studentService: StudentService,
    private meetService: MeetService,
    private _snackBar: MatSnackBar,
    private sharedDataService: SharedDataService,
    private router: Router,
    private _matDialog: MatDialog,
    ) {

    this.userId = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    if (this.userId) {
      this.studentService.getStudentDetails(this.userId).subscribe(response => {
        this.student = response;
        console.log(response);
      })
    }

    this.sendBreadCrumb();
  }



  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['USERS']);
  }


  tabController(tabName: string) {

    switch (tabName) {
      case 'DOCUMENTS':

        this.documentActive = true;
        this.dsActive = false;
        this.applicationsActive = false;

        break;
      case 'DS':

        this.documentActive = false;
        this.dsActive = true;
        this.applicationsActive = false;

        break;
      case 'APPLICATIONS':

        this.documentActive = false;
        this.dsActive = false;
        this.applicationsActive = true;

        break;
    }

  }

  meet() {


      this.meetService.getMeetingByUser(this.userId).subscribe(
        data => {
          if (data === null)
          {  this._snackBar.open('There is no meeting for the moment', 'close', {
            duration: 2000,
          });
          }
          else {

            if (this.student.dateNewMeet != null){
              const date = new Date();
              const formattedDate= date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
              if (this.student.dateNewMeet === formattedDate) {
                this.sharedDataService.nextMeeting(data);
                this.router.navigateByUrl('/fas-admin/fas-meet');
              } else {
                this._snackBar.open('The meeting did not start yet', 'close', {
                  duration: 2000,
                });
              }
            }
            else{  this._snackBar.open('The meeting did not start yet', 'close', {
              duration: 2000,
            });
            }
          }
        }
      );
  }


  addMeet()
  {
    this.dialogRef = this._matDialog.open(CreateMeetDialogComponent, {
      hasBackdrop: false
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if ( response ) {
        this.domain = 'meet.jit.si';
        this.options = {
          roomName: this.student.firstName + ' ' +this.student.lastName,
          width: 1000,
          height: 1000,
          configOverwrite: {startWithAudioMuted: true},
        };

        const date = new Date(response);
        this.formattedDate= date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

        const data = {
          meetName: this.options['roomName'],
          meetDate: this.formattedDate,
          meetLink: this.domain + '/' + this.options['roomName'],
          accountMeeting: {
            id: this.userId
          }
        };


        this.meetService.saveMeet(data).subscribe(
          data => {
            this.ngOnInit();
          },
          err => {
          });

      }
    });
  }

}
