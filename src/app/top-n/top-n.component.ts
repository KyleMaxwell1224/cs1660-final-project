import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadFilesService } from '../services/load-files.service';

@Component({
  selector: 'app-top-n',
  templateUrl: './top-n.component.html',
  styleUrls: ['./top-n.component.css']
})
export class TopNComponent implements OnInit {
  value = 1;

  constructor(private loadFileService: LoadFilesService, private router: Router ) { }

  submitTopN() {
    console.log(this.value)
    this.loadFileService.requestTopN(this.value);
  }

  ngOnInit(): void {
  }

}
