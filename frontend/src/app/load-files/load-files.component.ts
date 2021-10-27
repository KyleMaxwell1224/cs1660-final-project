import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-files',
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css']
})
export class LoadFilesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  submit() {
    console.log('submit');
  }
}
