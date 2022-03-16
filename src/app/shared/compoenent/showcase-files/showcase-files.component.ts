import {Component, Input, OnInit} from '@angular/core';
import {FileUploadService} from "../../services/file-upload.service";
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-showcase-files',
  templateUrl: './showcase-files.component.html',
  styleUrls: ['./showcase-files.component.scss']
})
export class ShowcaseFilesComponent implements OnInit {

  @Input() fileType: string;
  @Input() userId: number;

  fileNames: string[] = [];


  constructor(private uploadService: FileUploadService
  ) {
  }

  ngOnInit() {
    if (this.userId) {
      this.uploadService.getFilesByUser(this.fileType, this.userId).subscribe(response => {
        this.fileNames = response;
      })
    } else {
      this.uploadService.getFilesByType(this.fileType).subscribe(response => {
        this.fileNames = response;
      })
    }

  }


  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  downloadFile(fileName: string) {

    if (this.userId) {
      this.uploadService.downloadByUser(fileName, this.fileType, this.userId).subscribe(response => {
        let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        //window.open(url);
        //window.location.href = response.url;
        fileSaver.saveAs(blob, fileName);
      }), error => console.log('Error downloading the file'),
        () => console.info('File downloaded successfully');
    } else {
      this.uploadService.downloadByType(fileName, this.fileType).subscribe(response => {
        let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        //window.open(url);
        //window.location.href = response.url;
        fileSaver.saveAs(blob, fileName);
      }), error => console.log('Error downloading the file'),
        () => console.info('File downloaded successfully');
    }

  }

}
