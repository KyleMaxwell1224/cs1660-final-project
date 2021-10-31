import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-load-files',
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css']
})
export class LoadFilesComponent implements OnInit {
  files: any[]  = [];
  constructor() { }
  @ViewChild('selectedFile') selectedFile: ElementRef | undefined;

  ngOnInit(): void {
  }
  submit() {
    console.log('submit');
  }
  
  filesInputted(event: any) {
    console.log(this.selectedFile)
    this.selectedFile?.nativeElement.click();
    try {
      this.files = event.target.files;
      console.log(this.files);
    }
    catch (e) {
      console.log(e);
    }
  }

  bytesToMbs(bytes: number) {
    return (bytes / 1000 / 1000).toFixed(2);
  }
}
