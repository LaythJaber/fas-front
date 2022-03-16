import { Component, OnInit } from '@angular/core';
import {BreadcrumbService} from "../../../core/services/breadcrumb.service";
import {Subject} from "rxjs";
import {UserService} from "../../../shared/services/user.service";
import {Account} from "../../../shared/models/account.model";
import {MeetService} from "../../../shared/services/meet.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {MeetConfirmDialogComponent} from "./meet-confirm-dialog/meet-confirm-dialog.component";
import {SharedDataService} from "../../../shared/services/shared-data.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {


  // Private
  private _unsubscribeAll: Subject<any>;
  user: Account;

  constructor(private breadcrumbService: BreadcrumbService,
              private meetService: MeetService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private sharedDataService: SharedDataService,
              private router: Router,

  ) {
    this._unsubscribeAll = new Subject();

  }



    ngOnInit() {
      this.sendBreadCrumb();
      this.userService.identity().subscribe(response => {
        this.user = response;
      });

    }

    sendBreadCrumb(): void {
      this.breadcrumbService.sendBreadcrumb(['VIDEO']);
    }





  openDialog(): void {
    this.meetService.getMeetByCurrentUser().subscribe(
      data => {
        if (data === null)
        {  this._snackBar.open('There is no meeting for the moment', 'close', {
          duration: 2000,
        });
        }
        else {
          if(data.meetPwd != null){
            const dialogRef = this.dialog.open(MeetConfirmDialogComponent, {
              data:  data ,
              hasBackdrop: false
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.sharedDataService.nextMeeting(data);
                this.router.navigateByUrl('meet/call');

              }
            });
          }
          else{  this._snackBar.open('Meeting did not start yet', 'close', {
            duration: 2000,
          });
          }
        }
      }
    );

  }





}
