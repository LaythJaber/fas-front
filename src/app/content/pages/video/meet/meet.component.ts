import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../shared/services/user.service";
import {Account} from "../../../../shared/models/account.model";
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit {

  meet: any;
  domain: string;
  options: any;
  api: any;
  password: any;
  user: Account;

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.userService.identity().subscribe(response => {
      this.user = response;

      this.domain = 'meet.jit.si';
      this.options = {
        parentNode: document.querySelector('#meet'),
        roomName: this.user.firstName + ' ' +this.user.lastName,
        width: 1350,
        height: 700,
        userInfo: {
          email: this.user.email,
          displayName: this.user.firstName + ' ' + this.user.lastName
        },
        configOverwrite: {   startWithAudioMuted: true,
          startWithVideoMuted: true
        }
        /* interfaceConfigOverwrite: {
                         filmStripOnly: false
                         }*/
      };




      this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    })

  }
}

