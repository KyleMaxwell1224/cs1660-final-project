import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadFilesService } from '../services/load-files.service';

@Component({
  selector: 'app-load-files',
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css']
})
export class LoadFilesComponent implements OnInit {
  files: File[]  = [];
  loading: boolean = false;
  
  constructor(private loadFileService: LoadFilesService, private router: Router ) { }
  @ViewChild('selectedFile') selectedFile: ElementRef | undefined;

  ngOnInit(): void {}
  
  async submit(uploads: any) {
    this.loading = true;
    console.log(uploads);
    console.log('submitting' + this.files[0].name);
    var res = await this.loadFileService.uploadFiles(uploads.files);
    console.log(res);
    this.router.navigate(['/loaded']);
  }
  
  filesInputted(event: any) {
    console.log(this.selectedFile)
    this.selectedFile?.nativeElement.click();
    try {
      this.files = Array.from(event.target.files)
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
