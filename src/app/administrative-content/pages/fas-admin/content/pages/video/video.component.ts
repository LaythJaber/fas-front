import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import {SharedDataService} from "../../../../../../shared/services/shared-data.service";
import {MeetService} from "../../../../../../shared/services/meet.service";
import {UserService} from "../../../../../../shared/services/user.service";
import {Account} from "../../../../../../shared/models/account.model";
import {BreadcrumbService} from "../../../../../../core/services/breadcrumb.service";
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoComponent implements OnInit {
  meet: any;
  domain: string;
  options: any;
  api: any;
  password: any;

  user: Account;

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private sharedDataService: SharedDataService,
    private meetService: MeetService,
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
  )
  {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this.sharedDataService.sharedMeet.subscribe(message =>
    {  this.meet = message;
    });
  }

  ngOnInit(): void {
    this.breadcrumbService.sendBreadcrumb(['VIDEO']);


    this.userService.identity().subscribe(response => {
      this.user = response;
      this.domain = 'meet.jit.si';
      this.options = {
        parentNode: document.querySelector('#meet'),
        roomName: this.meet.meetName,
        width: 1350,
        height: 700,
        userInfo: {
          email: this.user.email,
          displayName: this.user.firstName + ' ' + this.user.lastName
        }
      };

      this.api = new JitsiMeetExternalAPI(this.domain, this.options);
      //const pass = this.meet.meetPwd;
      const pass = this.meet.idMeet + this.meet.meetLink;


      setTimeout(() => {
        // when local user is trying to enter in a locked room
        this.api.addEventListener('passwordRequired', () => {
          this.api.executeCommand('password', pass);
        });

        // when local user has joined the video conference
        this.api.addEventListener('videoConferenceJoined', (response) => {
          this.api.executeCommand('password', pass);
        });
      }, 10);

      var formData = new FormData();
      formData.set('pwd', this.meet.idMeet + this.meet.meetLink);

      //console.log("******************* "+this.meet.idMeet);
      //console.log("+++++++++++++++++++++++ "+this.meet.coursMeeting.nomCours);


      this.meetService.setPwd(formData, this.meet.idMeet).subscribe(
        data => {
        },
        err => {
        });

      this.api.on('readyToClose', () => {
        this.meetService.resetPwd(this.meet.idMeet).subscribe(
          data => {
          },
          err => {
          });
      });


    });
  }


}
