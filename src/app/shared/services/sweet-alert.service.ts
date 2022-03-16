import {Injectable} from '@angular/core';
import * as Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor(private translate: TranslateService) {
  }

  warning(msg: string) {
    return Swal.default.fire({
      icon: 'warning',
      html: msg,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
      this.translate.instant('BUTTONS.OK'),
      cancelButtonText:
        this.translate.instant('BUTTONS.CANCEL'),
      //confirmButtonClass: 'btn btn-success',
     // cancelButtonClass: 'btn btn-primary',
    });
  }

  danger(msg: string) {
    return Swal.default.fire({
      icon: 'error',
      text: msg,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      focusConfirm: false,
      confirmButtonText:
        'OK',
    //  confirmButtonClass: 'btn btn-danger',
    });
  }

  notification(msg: string) {
    return Swal.default.fire({
      icon: 'warning',
      text: msg,
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: false,
      focusCancel: true,
      cancelButtonText:
        'OK',
      timer: 7000
    });
  }

  success(msg: string) {
    return Swal.default.fire({
      icon: 'success',
      text: msg,
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: false,
      focusCancel: true,
      cancelButtonText:
        'OK',
      timer: 4000
    });
  }

}
